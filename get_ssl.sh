#!/bin/bash

function install_dns_utils() {
    if ! command -v dig &> /dev/null; then
        echo "dig 未安装，正在安装 dnsutils..."
        sudo apt-get update && sudo apt-get install -y dnsutils
    fi
}

function check_certificate_exists() {
    domain="$1"
    domain_ecc="${domain}_ecc"

    echo "$HOME/.acme.sh/$domain_ecc/fullchain.cer"

    if [[ -f "$HOME/.acme.sh/$domain_ecc/fullchain.cer" ]] && [[ -f "$HOME/.acme.sh/$domain_ecc/$domain.key" ]]; then
        echo "已经拥有证书。"
        return 0
    else
        echo "没有找到证书文件。"
        return 1
    fi
}

function install_or_renew_letsencrypt_tls() {
    install_dns_utils

    # 定义 acme.sh 的安装路径
    ACME_SH="$HOME/.acme.sh/acme.sh"

    # 安装 acme.sh
    if [ ! -f "$ACME_SH" ]; then
        echo "正在安装 acme.sh..."
        curl https://get.acme.sh | sh
        # 重新加载 shell 配置
        source "$HOME/.bashrc"
    fi

    # 输入域名
    read -p "请输入你要为其获取证书的域名: " domain

    if [[ -z "$domain" ]]; then
        echo "域名不能为空。"
        return 1
    fi

    domain_ecc="${domain}_ecc"

    echo "domain_ecc $domain_ecc"

    # 检查是否已经拥有证书
    if check_certificate_exists "$domain"; then
        # 如果已经拥有证书，询问是否强制重新生成
        read -p "已经拥有证书，是否强制重新生成？(y/n): " force_renew
        if [[ "$force_renew" == "y" || "$force_renew" == "Y" ]]; then
            "$ACME_SH" --renew -d "$domain" --force
        else
            echo "取消证书生成。"
            return 0
        fi
    else
        # 如果没有证书，正常生成
        # 解析域名并获取其 IP 地址
        domain_ip=$(dig +short "$domain")
        echo "域名 $domain 解析到的 IP 地址: $domain_ip"

        # 获取服务器的公网 IP 地址
        server_ip=$(curl -s http://icanhazip.com)
        echo "服务器的公网 IP 地址: $server_ip"

        # 检查域名解析的 IP 地址是否与服务器的 IP 地址匹配
        if [[ "$domain_ip" != "$server_ip" ]]; then
            echo "错误: 域名解析的 IP 地址与服务器的 IP 地址不匹配。"
            return 1
        fi

        # 结束占用 80 端口的进程
        echo "正在检查并结束占用 80 端口的进程..."
        sudo fuser -k 80/tcp

        # 使用 acme.sh 的完整路径生成证书
        echo "正在从 Let's Encrypt 获取证书..."
        "$ACME_SH" --issue --standalone -d "$domain" --keylength ec-256 --server letsencrypt --force --debug
    fi

    # 再次检查证书是否生成成功
    if check_certificate_exists "$domain"; then
        echo "证书成功生成。"
        echo "证书路径: $HOME/.acme.sh/$domain_ecc/fullchain.cer"
        echo "私钥路径: $HOME/.acme.sh/$domain_ecc/$domain.key"
    else
        echo "证书生成失败。"
        return 1
    fi
}

install_or_renew_letsencrypt_tls
