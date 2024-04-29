import CustomMessageBox from '@/components/CustomMessageBox';
import { MessageBox } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css';

const ChatScreen = () => {
    const messages = [
        {
            position: 'right',
            type: 'text',
            text: 'Hello, how can I help you?',
            date: new Date(),
        },
        {
            position: 'left',
            type: 'text',
            text: 'Hi there!',
            date: new Date(),
        },
        {
            position: 'right',
            type: 'text',
            text: 'Do you have any questions?',
            date: new Date(),
        },
        {
            videoURL: 'https://www.sample-videos.com/video123/mp4/240/big_buck_bunny_240p_1mb.mp4',
            status: {
                click: true,
                loading: 0.5,
                download: true,
            },
        },
    ];

    return (
        <div
            style={{ height: '500px', width: 'auto', border: '1px solid #ccc', overflowY: 'auto' }}
        >
            {messages.map((message, index) => (
                <CustomMessageBox key={index} />
            ))}

            <MessageBox
                position={'left'}
                type={'video'}
                title={'Kursat'}
                data={{
                    videoURL:
                        'http://0.0.0.0:25432/file_store/get_file_uu_id/46ba8070-6af9-4940-ba04-9111c95c16dc',
                    width: 320,
                    height: 240,
                    status: {
                        click: true,
                        loading: 0.5,
                        download: true,
                    },
                }}
            />
        </div>
    );
};

export default ChatScreen;
