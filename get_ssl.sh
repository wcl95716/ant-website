#!/bin/bash

# 检查是否提供了 COMMON_NAME
if [ -z "$1" ]; then
    echo "Usage: $0 COMMON_NAME"
    exit 1
fi

# 设置证书的信息
COMMON_NAME="$1"
ORGANIZATION="Example Organization"
COUNTRY="US"
STATE="California"
LOCALITY="Mountain View"
EMAIL="admin@example.com"
VALID_DAYS=3650  # 证书有效期

# 生成私钥
openssl genpkey -algorithm RSA -out key.pem

# 生成证书签发请求 (CSR)
openssl req -new -key key.pem -out csr.pem -subj "/C=$COUNTRY/ST=$STATE/L=$LOCALITY/O=$ORGANIZATION/CN=$COMMON_NAME/emailAddress=$EMAIL"

# 生成自签名证书
openssl x509 -req -days $VALID_DAYS -in csr.pem -signkey key.pem -out cert.pem

# 删除 CSR 文件（可选）
rm csr.pem

echo "证书生成成功！"

