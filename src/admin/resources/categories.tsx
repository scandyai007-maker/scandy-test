import {
  List,
  Create,
  Edit,
  useTable,
  EditButton,
  DeleteButton,
} from "@refinedev/antd";
import { Table, Space, Form, Input, Select, InputNumber, Tabs } from "antd";
import { useForm } from "@refinedev/antd";
import { useState } from "react";

export const CategoryList = () => {
  const [activeTab, setActiveTab] = useState("platform");

  const { tableProps } = useTable({
    syncWithLocation: false, // Turn off to avoid URL state conflict with tabs
    filters: {
      permanent: [
        {
          field: "type",
          operator: "eq",
          value: activeTab,
        },
      ],
    },
    sorters: {
      initial: [
        {
          field: "rank",
          order: "asc", 
        },
      ],
    },
  });

  return (
    <List>
      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key)}
        items={[
          { key: "platform", label: "Platform & Games Categories" },
          { key: "news", label: "News & Articles Categories" },
        ]}
        style={{ marginBottom: 16 }}
      />
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="rank" title="Display Order (Rank)" width={80} align="center" />
        <Table.Column dataIndex="name" title="Category Name" />
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

export const CategoryCreate = () => {
  const { formProps, saveButtonProps } = useForm();

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Category Name"
          name="name"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Target Type"
          name="type"
          rules={[{ required: true }]}
        >
          <Select
            options={[
              { label: 'Platform & Games', value: 'platform' },
              { label: 'News & Articles', value: 'news' },
            ]}
          />
        </Form.Item>
        <Form.Item
          label="Display Rank"
          name="rank"
          rules={[{ required: true }]}
          extra="Lower numbers appear first"
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Create>
  );
};

export const CategoryEdit = () => {
  const { formProps, saveButtonProps } = useForm();

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Category Name"
          name="name"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Target Type"
          name="type"
          rules={[{ required: true }]}
        >
          <Select
            options={[
              { label: 'Platform & Games', value: 'platform' },
              { label: 'News & Articles', value: 'news' },
            ]}
          />
        </Form.Item>
        <Form.Item
          label="Display Rank"
          name="rank"
          rules={[{ required: true }]}
          extra="Lower numbers appear first"
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Edit>
  );
};
