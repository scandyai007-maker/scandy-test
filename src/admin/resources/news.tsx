import React, { useState } from "react";
import { List, Create, Edit, useTable, useForm, EditButton, DeleteButton, DateField, BooleanField, useSelect } from "@refinedev/antd";
import { Table, Space, Form, Input, Checkbox, Select, Button, Modal, message } from "antd";
import { Sparkles } from "lucide-react";
import { ImageUpload } from "../components/ImageUpload";
import { RichTextEditor } from "../components/RichTextEditor";

const AIFillNewsButton = ({ onFill }: { onFill: (data: any) => void }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [theme, setTheme] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!theme) {
      message.error("Please enter a news theme or keyword");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("/api/ai-fill-news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme }),
      });
      const data = await response.json();
      if (response.ok) {
        onFill(data);
        setIsModalVisible(false);
        message.success("News content generated successfully!");
      } else {
        message.error(data.error || "Failed to generate content");
      }
    } catch (error) {
      message.error("Network error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button 
        type="primary" 
        icon={<Sparkles size={16} />} 
        onClick={() => setIsModalVisible(true)}
        className="bg-purple-600 hover:bg-purple-700 border-purple-600 flex items-center gap-1"
      >
        AI 撰写资讯
      </Button>
      <Modal
        title="AI 撰稿助手"
        open={isModalVisible}
        onOk={handleGenerate}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={isLoading}
        okText="生成文章"
        cancelText="取消"
        destroyOnClose
      >
        <p className="mb-4 text-gray-500 text-sm">输入您想报道的行业动态主题（如：“巴基斯坦严打非法博彩平台”、“2026年最新电竞赞助”），AI将为您撰写一篇图文并茂的深度行业文章。</p>
        <Input.TextArea 
          placeholder="例如：探讨 1xbet 在印度市场的本地化支付变革..." 
          rows={3}
          value={theme} 
          onChange={(e) => setTheme(e.target.value)}
          autoFocus
        />
      </Modal>
    </>
  );
};

export const NewsList = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
    sorters: {
      initial: [
        {
          field: "updated_at",
          order: "desc",
        },
      ],
    },
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="title" title="Title" />
        <Table.Column dataIndex="category" title="Category" />
        <Table.Column dataIndex="author" title="Author" />
        <Table.Column 
          dataIndex="created_at" 
          title="Created At" 
          sorter
          render={(value) => <DateField format="YYYY-MM-DD HH:mm" value={value} />} 
        />
        <Table.Column 
          dataIndex="updated_at" 
          title="Updated At" 
          sorter
          render={(value) => <DateField format="YYYY-MM-DD HH:mm" value={value} />} 
        />
        <Table.Column 
          dataIndex="is_featured" 
          title="Featured" 
          render={(value: any) => <BooleanField value={value} />} 
        />
        <Table.Column
          title="Actions"
          dataIndex="actions"
          render={(_, record: any) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};

export const NewsCreate = () => {
  const { formProps, saveButtonProps, form } = useForm();
  
  const { selectProps: categorySelectProps } = useSelect({
    resource: "categories",
    optionLabel: "name",
    optionValue: "name", 
    filters: [{ field: "type", operator: "eq", value: "news" }],
    sorters: [{ field: "rank", order: "asc" }]
  });

  const { selectProps: tagsSelectProps } = useSelect({
    resource: "tags",
    optionLabel: "name",
    optionValue: "name",
  });

  const handleAIFill = (data: any) => {
    form.setFieldsValue({
      ...data,
      slug: data.slug || data.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    });
  };

  return (
    <Create 
      saveButtonProps={saveButtonProps}
      headerProps={{
        extra: <AIFillNewsButton onFill={handleAIFill} />
      }}
    >
      <Form {...formProps} form={form} layout="vertical">
        <Form.Item label="Title" name="title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Slug (URL Path)" name="slug" rules={[{ required: true }]} extra="Auto-generated from title if left empty.">
          <Input placeholder="e.g. neonvegas-partners-with-visa" />
        </Form.Item>
        <Form.Item label="Excerpt" name="excerpt">
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item label="Content (Rich Text)" name="content" rules={[{ required: true }]}>
          <RichTextEditor />
        </Form.Item>
        <Form.Item label="Category" name="category" rules={[{ required: true }]}>
          <Select {...categorySelectProps} />
        </Form.Item>
        <Form.Item label="Cover Image" name="image" rules={[{ required: true }]}>
          <ImageUpload />
        </Form.Item>
        <Form.Item label="Tag Selection" name="tags" rules={[{ required: false }]}>
          <Select mode="multiple" {...tagsSelectProps} placeholder="Select tags" />
        </Form.Item>
        <Form.Item label="Author" name="author" rules={[{ required: false }]} initialValue="System">
          <Input placeholder="System" />
        </Form.Item>
        <Form.Item name="is_featured" valuePropName="checked">
          <Checkbox>Feature this article</Checkbox>
        </Form.Item>
        <div style={{ marginTop: '24px', padding: '16px', background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: '8px' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>SEO Settings</h3>
          <Form.Item label="SEO Title" name="seo_title">
            <Input />
          </Form.Item>
          <Form.Item label="SEO Description" name="seo_description">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item label="SEO Keywords" name="seo_keywords" extra="Comma separated keywords">
            <Input />
          </Form.Item>
        </div>
      </Form>
    </Create>
  );
};

export const NewsEdit = () => {
  const { formProps, saveButtonProps, form } = useForm();
  
  const { selectProps: categorySelectProps } = useSelect({
    resource: "categories",
    optionLabel: "name",
    optionValue: "name", 
    filters: [{ field: "type", operator: "eq", value: "news" }],
    sorters: [{ field: "rank", order: "asc" }]
  });

  const { selectProps: tagsSelectProps } = useSelect({
    resource: "tags",
    optionLabel: "name",
    optionValue: "name",
  });

  const handleAIFill = (data: any) => {
    form.setFieldsValue({
      ...data,
      slug: data.slug || data.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    });
  };

  return (
    <Edit 
      saveButtonProps={saveButtonProps}
      headerProps={{
        extra: <AIFillNewsButton onFill={handleAIFill} />
      }}
    >
      <Form {...formProps} form={form} layout="vertical">
        <Form.Item label="Title" name="title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Slug (URL Path)" name="slug" rules={[{ required: true }]} extra="The URL-friendly identifier for this article.">
          <Input placeholder="e.g. neonvegas-partners-with-visa" />
        </Form.Item>
        <Form.Item label="Excerpt" name="excerpt">
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item label="Content (Rich Text)" name="content" rules={[{ required: true }]}>
          <RichTextEditor />
        </Form.Item>
        <Form.Item label="Cover Image" name="image" rules={[{ required: true }]}>
          <ImageUpload />
        </Form.Item>
        <Form.Item label="Category" name="category" rules={[{ required: true }]}>
           <Select {...categorySelectProps} />
        </Form.Item>
        <Form.Item label="Tag Selection" name="tags" rules={[{ required: false }]}>
          <Select mode="multiple" {...tagsSelectProps} placeholder="Select tags" />
        </Form.Item>
        <Form.Item label="Author" name="author" rules={[{ required: false }]} initialValue="System">
          <Input placeholder="System" />
        </Form.Item>
        <Form.Item name="is_featured" valuePropName="checked">
          <Checkbox>Feature this article</Checkbox>
        </Form.Item>
        <div style={{ marginTop: '24px', padding: '16px', background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: '8px' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>SEO Settings</h3>
          <Form.Item label="SEO Title" name="seo_title">
            <Input />
          </Form.Item>
          <Form.Item label="SEO Description" name="seo_description">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item label="SEO Keywords" name="seo_keywords" extra="Comma separated keywords">
            <Input />
          </Form.Item>
        </div>
      </Form>
    </Edit>
  );
};
