import React from "react";
import { List, Create, Edit, useTable, useForm, EditButton, DeleteButton, DateField, BooleanField, useSelect } from "@refinedev/antd";
import { Table, Space, Form, Input, Checkbox, Select } from "antd";
import { ImageUpload } from "../components/ImageUpload";
import { RichTextEditor } from "../components/RichTextEditor";

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
  const { formProps, saveButtonProps } = useForm();
  
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

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
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
  const { formProps, saveButtonProps } = useForm();
  
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

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
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
