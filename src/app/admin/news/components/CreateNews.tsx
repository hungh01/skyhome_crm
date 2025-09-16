'use client';

import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Row,
  Col,
  Select,
  Upload,
  message,
  Modal,
  InputNumber,
  Image,
  DatePicker
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  EyeOutlined,
  SaveOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { useState, useEffect } from 'react';

import dayjs from 'dayjs';
import { News, NewsRequest, NewsStatus } from '../type/news';
import { useNewsActions } from '../hooks/useNewsActions';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// News categories based on enum from News.ts
const newsCategories = [
  { value: 'Tin tức', label: 'Tin tức' },
  { value: 'Khuyến mãi', label: 'Khuyến mãi' },
  { value: 'Dịch vụ', label: 'Dịch vụ' },
  { value: 'Hướng dẫn', label: 'Hướng dẫn' },
  { value: 'Giới thiệu', label: 'Giới thiệu' },
  { value: 'Câu hỏi thường gặp', label: 'Câu hỏi thường gặp' }
];

interface Props {
  onSuccess?: () => void;
  initialData?: News; // If provided, form will be in edit mode
}

export default function CreateNews({ onSuccess, initialData }: Props) {
  const [form] = Form.useForm();

  const [imageUrl, setImageUrl] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string>('');


  // Image preview modal states
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  const { handleSaveNews, loading } = useNewsActions();

  // Effect to populate form when editing
  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        title: initialData.title,
        shortDescription: initialData.shortDescription,
        content: initialData.content,
        category: initialData.category,
        position: initialData.position,
        status: initialData.status,
        publishedAt: initialData.publishedAt ? dayjs(initialData.publishedAt) : null,
        author: initialData.author,
      });

      // Set image if exists
      if (initialData.imageUrl) {
        setImageUrl(initialData.imageUrl);
        setImagePreview(initialData.imageUrl);
      }
    }
  }, [initialData, form]);

  // Image handling functions
  const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleImageChange = async (file: File): Promise<void> => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      message.error('Chỉ chấp nhận file hình ảnh!');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      message.error('Kích thước file không được vượt quá 5MB!');
      return;
    }

    try {
      const imageUrl = await getBase64(file);
      setImageUrl(imageUrl);
      setImagePreview(imageUrl);
      message.success('Tải ảnh thành công!');
    } catch (error) {
      console.error('Upload error:', error);
      message.error('Tải ảnh thất bại!');
    }
  };

  const handleSubmit = async (values: NewsRequest): Promise<void> => {
    // if (!imageUrl) {
    //   message.error('Vui lòng tải lên hình ảnh tin tức!');
    //   return;
    // }


    try {
      const newsData: NewsRequest = {
        _id: initialData?._id,
        title: values.title,
        shortDescription: values.shortDescription,
        content: values.content,
        category: values.category,
        position: values.position,
        imageUrl: imageUrl,
        status: values.status,
        publishedAt: values.publishedAt,
        author: values.author,
      };

      await handleSaveNews(newsData);
      // Reset form if creating new
      if (!initialData) {
        handleReset();
      }

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Submit error:', error);
      message.error('Có lỗi xảy ra, vui lòng thử lại!');
    }
  };

  const handleReset = (): void => {
    form.resetFields();
    setImageUrl('');
    setImagePreview('');
    setPreviewOpen(false);
    setPreviewImage('');
    setPreviewTitle('');
  };

  return (
    <div style={{ padding: onSuccess ? '24px' : '24px', background: onSuccess ? 'transparent' : '#f5f5f5', minHeight: onSuccess ? 'auto' : '100vh' }}>
      <Row justify="center" gutter={24}>
        <Col xs={24} xl={onSuccess ? 24 : 16}>
          <Card
            style={{
              boxShadow: onSuccess ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.1)',
              borderRadius: '8px',
              marginBottom: '24px',
              border: onSuccess ? 'none' : undefined
            }}
          >
            {!onSuccess && (
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <Title level={2} style={{ color: '#1890ff', marginBottom: '8px' }}>
                  {initialData ? 'Chỉnh sửa Bài viết' : 'Tạo Bài viết mới'}
                </Title>
                <Text type="secondary">
                  {initialData ? 'Cập nhật thông tin bài viết hiện tại' : 'Tạo bài viết với thông tin chi tiết'}
                </Text>
              </div>
            )}

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                status: NewsStatus.ACTIVE,
                position: 1,
                category: 'Tin tức'
              }}
            >
              <Title level={4} style={{ marginBottom: '16px' }}>
                Thông tin cơ bản
              </Title>

              <Row gutter={16}>
                <Col xs={24} md={16}>
                  <Form.Item
                    label="Tiêu đề bài viết"
                    name="title"
                    rules={[
                      { required: true, message: 'Vui lòng nhập tiêu đề!' },
                      { min: 5, message: 'Tiêu đề phải có ít nhất 5 ký tự!' },
                      { max: 200, message: 'Tiêu đề không được vượt quá 200 ký tự!' }
                    ]}
                  >
                    <Input placeholder="Nhập tiêu đề bài viết" showCount maxLength={200} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    label="Vị trí hiển thị"
                    name="position"
                    rules={[{ required: true, message: 'Vui lòng nhập vị trí!' }]}
                  >
                    <InputNumber
                      placeholder="Vị trí"
                      style={{ width: '100%' }}
                      min={1}
                      max={99}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Mô tả ngắn"
                name="shortDescription"
                rules={[
                  { required: true, message: 'Vui lòng nhập mô tả ngắn!' },
                  { min: 10, message: 'Mô tả phải có ít nhất 10 ký tự!' },
                  { max: 500, message: 'Mô tả không được vượt quá 500 ký tự!' }
                ]}
              >
                <TextArea
                  rows={3}
                  placeholder="Nhập mô tả ngắn về bài viết..."
                  showCount
                  maxLength={500}
                />
              </Form.Item>


              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Danh mục"
                    name="category"
                    rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                  >
                    <Select placeholder="Chọn danh mục bài viết">
                      {newsCategories.map(category => (
                        <Option key={category.value} value={category.value}>
                          {category.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                {/* <Col xs={24} md={12}>
                  <Form.Item
                    label="Tác giả"
                    name="author"
                    rules={[{ required: true, message: 'Vui lòng nhập tên tác giả!' }]}
                  >
                    <Input placeholder="Nhập tên tác giả" />
                  </Form.Item>
                </Col> */}
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Ngày xuất bản"
                    name="publishedAt"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày xuất bản!' }]}
                  >
                    <DatePicker
                      style={{ width: '100%' }}
                      placeholder="Chọn ngày xuất bản"
                      format="DD/MM/YYYY"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Trạng thái"
                    name="status"
                    rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                  >
                    <Select placeholder="Chọn trạng thái">
                      <Option value={NewsStatus.ACTIVE}>
                        <span style={{ color: '#52c41a' }}>● Hoạt động</span>
                      </Option>
                      <Option value={NewsStatus.INACTIVE}>
                        <span style={{ color: '#ff4d4f' }}>● Tạm ngừng</span>
                      </Option>
                      <Option value={NewsStatus.DRAFT}>
                        <span style={{ color: '#faad14' }}>● Bản nháp</span>
                      </Option>
                      <Option value={NewsStatus.PUBLISHED}>
                        <span style={{ color: '#52c41a' }}>● Đã xuất bản</span>
                      </Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Hình ảnh bài viết"
              >
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <Upload
                    listType="picture-card"
                    showUploadList={false}
                    customRequest={({ file, onSuccess }) => {
                      handleImageChange(file as File);
                      onSuccess?.(file);
                    }}
                    accept="image/*"
                  >
                    {imagePreview ? (
                      <Image
                        src={imagePreview}
                        alt="News image preview"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '6px'
                        }}
                        preview={false}
                      />
                    ) : (
                      <div style={{ padding: '20px', textAlign: 'center' }}>
                        <PlusOutlined />
                        <div style={{ marginTop: 8, fontSize: '12px' }}>
                          Tải ảnh bài viết
                        </div>
                      </div>
                    )}
                  </Upload>
                  {imagePreview && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <Button
                        type="default"
                        icon={<EyeOutlined />}
                        onClick={() => {
                          setPreviewImage(imagePreview);
                          setPreviewOpen(true);
                          setPreviewTitle('Hình ảnh bài viết');
                        }}
                        size="small"
                      >
                        Xem trước
                      </Button>
                      <Button
                        type="default"
                        icon={<DeleteOutlined />}
                        onClick={() => {
                          setImagePreview('');
                          setImageUrl('');
                          message.success('Đã xóa ảnh!');
                        }}
                        size="small"
                        danger
                      >
                        Xóa ảnh
                      </Button>
                    </div>
                  )}
                </div>
                <Text type="secondary" style={{ fontSize: '12px', marginTop: 8, display: 'block' }}>
                  Tỷ lệ khuyến nghị: 16:9 | Tối đa 5MB | Định dạng: JPG, PNG, GIF
                </Text>
              </Form.Item>

              <Row gutter={16} style={{ marginTop: 32 }}>
                <Col xs={24} sm={12}>
                  <Button
                    size="large"
                    block
                    onClick={handleReset}
                    icon={<ReloadOutlined />}
                    disabled={loading}
                  >
                    Làm mới
                  </Button>
                </Col>
                <Col xs={24} sm={12}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    block
                    loading={loading}
                    icon={<SaveOutlined />}
                  >
                    {loading ? 'Đang lưu...' : initialData ? 'Cập nhật Bài viết' : 'Tạo Bài viết'}
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>
      </Row>

      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
        centered
        width={800}
      >
        <Image alt="News preview" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
}
