import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Flex, Spin } from 'antd';

export default function Rotage() {
    return (
        <Flex align="center" gap="middle">
            <Spin indicator={<LoadingOutlined spin />} size="large" />
        </Flex>
    );
}

