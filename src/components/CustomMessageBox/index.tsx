import { MessageBox } from 'react-chat-elements';

/**
 * CustomMessageBox 组件
 *
 * @param position 消息框的位置。默认为 'right'。
 * @param title 消息框的标题。
 * @param type 消息框内容的类型。默认为 'text'。
 * @param text 消息框的文本内容。
 * @param date 消息的日期。
 * @param replyButton 是否显示回复按钮的布尔值。默认为 true。
 * @param key 消息框组件的键。
 * @param id 消息框的唯一标识符。
 * @param focus 是否应该聚焦于消息框的布尔值。默认为 true。
 * @param titleColor 标题的颜色。默认为 'black'。
 * @param forwarded 消息是否已转发的布尔值。默认为 false。
 * @param removeButton 是否显示删除按钮的布尔值。默认为 false。
 * @param status 消息的状态。默认为 'sent'。
 * @param notch 是否显示缺口的布尔值。默认为 false。
 * @param retracted 消息是否已撤回的布尔值。默认为 false。
 * @param data
 */
const CustomMessageBox = ({
    position = 'right',
    title = '',
    type = 'text',
    text = '',
    date = new Date(),
    replyButton = false,
    key = 0,
    id = '',
    focus = true,
    titleColor = 'black',
    forwarded = false,
    removeButton = false,
    status = 'sent',
    notch = false,
    retracted = false,
    data = undefined,
}) => {
    return (
        // 忽略 TypeScript 报错
        // @ts-ignore
        <MessageBox
            position={position}
            title={title}
            type={type}
            text={text}
            date={date}
            replyButton={replyButton}
            key={key}
            id={id}
            focus={focus}
            titleColor={titleColor}
            forwarded={forwarded}
            removeButton={removeButton}
            status={status}
            notch={notch}
            retracted={retracted}
            data={data}
        />
    );
};

export default CustomMessageBox;
