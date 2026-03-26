import React from "react";
import { List, Create, Edit, useTable, useForm, EditButton, DeleteButton, BooleanField, useSelect, DateField } from "@refinedev/antd";
import { Table, Space, Avatar, Form, Input, InputNumber, Checkbox, Select } from "antd";
import { ImageUpload } from "../components/ImageUpload";
import { RichTextEditor } from "../components/RichTextEditor";

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
  const { formProps, saveButtonProps } = useForm();
  
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

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
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
  const { formProps, saveButtonProps } = useForm();

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

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
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
