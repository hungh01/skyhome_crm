
import { Flex, Modal } from 'antd';

interface NotificationModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    message: string;
    onOk: () => void;
}

export default function NotificationModal(props: NotificationModalProps) {
    return (
        <Flex vertical gap="middle" align="flex-start">
            <Modal
                title="Notification"
                centered
                open={props.open}
                onOk={() => props.onOk()}
                onCancel={() => props.setOpen(false)}
                width={{
                    xs: '90%',
                    sm: '80%',
                    md: '70%',
                    lg: '60%',
                    xl: '50%',
                    xxl: '40%',
                }}
            >
                <p>{props.message}</p>
            </Modal>
        </Flex>
    );
};
