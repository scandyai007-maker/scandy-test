import React, { useState } from "react";
import { List, Create, Edit, useTable, useForm, EditButton, DeleteButton, BooleanField, useSelect, DateField } from "@refinedev/antd";
import { Table, Space, Avatar, Form, Input, InputNumber, Checkbox, Select, Button, Modal, message } from "antd";
import { Sparkles } from "lucide-react";
import { ImageUpload } from "../components/ImageUpload";
import { RichTextEditor } from "../components/RichTextEditor";

const AIFillButton = ({ onFill }: { onFill: (data: any) => void }) => {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [keyword, setKeyword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleGenerate = async () => {
    if (!keyword) {
      message.error("Please enter a keyword");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("/api/ai-fill-platform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword }),
      });
      const data = await response.json();
      if (response.ok) {
        onFill(data);
        setIsModalVisible(false);
        message.success("Content generated successfully!");
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
        AI 一键填充
      </Button>
      <Modal
        title="AI 内容助手"
        open={isModalVisible}
        onOk={handleGenerate}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={isLoading}
        okText="生成内容"
        cancelText="取消"
        destroyOnClose
      >
        <p className="mb-4 text-gray-500 text-sm">输入平台名称或地区关键词（如: PAKWIN777 或 Pakistan Gaming），AI 将自动为您填充表单。</p>
        <Input 
          placeholder="输入关键词..." 
          value={keyword} 
          onChange={(e) => setKeyword(e.target.value)}
          onPressEnter={handleGenerate}
          autoFocus
        />
      </Modal>
    </>
  );
};

export const PlatformList = () => {
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
        <Table.Column 
          dataIndex="logo" 
          title="Logo" 
          render={(value) => <Avatar src={value} shape="square" size="large" />} 
        />
        <Table.Column dataIndex="name" title="Name" />
        <Table.Column dataIndex="category" title="Category" />
        <Table.Column dataIndex="score" title="Score" />
        <Table.Column 
          dataIndex="is_verified" 
          title="Verified" 
          render={(value: any) => <BooleanField value={value} />} 
        />
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

export const PlatformCreate = () => {
  const { formProps, saveButtonProps, form } = useForm();
  
  const { selectProps: tagsSelectProps } = useSelect({
    resource: "tags",
    optionLabel: "name",
    optionValue: "name",
  });

  const { selectProps: categorySelectProps } = useSelect({
    resource: "categories",
    optionLabel: "name",
    optionValue: "name",
    filters: [{ field: "type", operator: "eq", value: "platform" }],
    sorters: [{ field: "rank", order: "asc" }]
  });

  const handleAIFill = (data: any) => {
    form.setFieldsValue({
      ...data,
      // Handle slug if empty
      slug: data.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    });
  };

  return (
    <Create 
      saveButtonProps={saveButtonProps}
      headerProps={{
        extra: <AIFillButton onFill={handleAIFill} />
      }}
    >
      <Form {...formProps} form={form} layout="vertical">
        <Form.Item label="Platform Name" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Slug (URL Path)" name="slug" rules={[{ required: true }]} extra="Auto-generated from name if left empty. Only lowercase letters, numbers, and hyphens.">
          <Input placeholder="e.g. pakwin777" />
        </Form.Item>
        <Form.Item label="Category" name="category" rules={[{ required: true }]}>
          <Select {...categorySelectProps} />
        </Form.Item>
        <Form.Item label="Score (0-10)" name="score" rules={[{ required: true }]}>
          <InputNumber min={0} max={10} step={0.1} />
        </Form.Item>
        <Form.Item label="Logo URL" name="logo" rules={[{ required: true }]}>
          <ImageUpload />
        </Form.Item>
        <Form.Item label="Bonus Details" name="bonus" rules={[{ required: true }]} extra="e.g. 100% up to $500 + 200 Free Spins">
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item label="Tags" name="tags" rules={[{ required: false }]}>
          <Select mode="multiple" {...tagsSelectProps} placeholder="Select tags" />
        </Form.Item>
        <Form.Item label="Features (bullets)" name="features" rules={[{ required: true }]}>
          <Select mode="tags" style={{ width: '100%' }} placeholder="Press enter to add feature" />
        </Form.Item>
        <Form.Item name="is_verified" valuePropName="checked">
          <Checkbox>Verified Platform</Checkbox>
        </Form.Item>
        <Form.Item label="Content (Rich Text)" name="content">
          <RichTextEditor />
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

export const PlatformEdit = () => {
  const { formProps, saveButtonProps, form } = useForm();

  const { selectProps: tagsSelectProps } = useSelect({
    resource: "tags",
    optionLabel: "name",
    optionValue: "name",
  });
  
  const { selectProps: categorySelectProps } = useSelect({
    resource: "categories",
    optionLabel: "name",
    optionValue: "name",
    filters: [{ field: "type", operator: "eq", value: "platform" }],
    sorters: [{ field: "rank", order: "asc" }]
  });

  const handleAIFill = (data: any) => {
    form.setFieldsValue(data);
  };

  return (
    <Edit 
      saveButtonProps={saveButtonProps}
      headerProps={{
        extra: <AIFillButton onFill={handleAIFill} />
      }}
    >
      <Form {...formProps} form={form} layout="vertical">
        <Form.Item label="Platform Name" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Slug (URL Path)" name="slug" rules={[{ required: true }]} extra="The URL-friendly identifier for this platform.">
          <Input placeholder="e.g. pakwin777" />
        </Form.Item>
        <Form.Item label="Category" name="category" rules={[{ required: true }]}>
          <Select {...categorySelectProps} />
        </Form.Item>
        <Form.Item label="Score (0-10)" name="score" rules={[{ required: true }]}>
          <InputNumber min={0} max={10} step={0.1} />
        </Form.Item>
        <Form.Item label="Logo URL" name="logo" rules={[{ required: true }]}>
          <ImageUpload />
        </Form.Item>
        <Form.Item label="Bonus Details" name="bonus" rules={[{ required: true }]} extra="e.g. 100% up to $500 + 200 Free Spins">
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item label="Tags" name="tags" rules={[{ required: false }]}>
          <Select mode="multiple" {...tagsSelectProps} placeholder="Select tags" />
        </Form.Item>
        <Form.Item label="Features (bullets)" name="features" rules={[{ required: true }]}>
          <Select mode="tags" style={{ width: '100%' }} placeholder="Press enter to add feature" />
        </Form.Item>
        <Form.Item name="is_verified" valuePropName="checked">
          <Checkbox>Verified Platform</Checkbox>
        </Form.Item>
        <Form.Item label="Content (Rich Text)" name="content">
          <RichTextEditor />
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
