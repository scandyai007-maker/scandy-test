import React, { useEffect } from "react";
import { EditButton, Edit, useForm } from "@refinedev/antd";
import { Form, Input, Button, Space } from "antd";
import { Download, FileText } from "lucide-react";


export const SiteSettingsEdit = () => {
  // We use `useForm` but we don't pass an id because site_settings is a singleton 
  // We enforce id=1 in the DB. We can force the id parameter here.
  const { formProps, saveButtonProps, query } = useForm({
    resource: "site_settings",
    action: "edit",
    id: 1,
  });

  return (
    <Edit 
      title="Global SEO & Site Settings" 
      saveButtonProps={saveButtonProps}
      headerProps={{ extra: null }} // hide delete button
    >
      <Form {...formProps} layout="vertical">
        <Form.Item label="Site Name" name="site_name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Global SEO Title" name="seo_title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Global Meta Description" name="seo_description" rules={[{ required: true }]}>
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item label="Global Meta Keywords" name="seo_keywords" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Robots.txt Content" name="robots_txt" extra="Specify your site's robots.txt rules here.">
          <Input.TextArea rows={10} placeholder="User-agent: *\nAllow: /" />
        </Form.Item>

        <Form.Item label="Sitemap Management" extra="The sitemap is dynamically generated and always up-to-date.">
          <Space>
            <Button 
              type="primary" 
              icon={<Download size={16} />} 
              href="/sitemap.xml" 
              target="_blank"
              download="sitemap.xml"
              className="bg-amber-500 hover:bg-amber-600 border-amber-500"
            >
              Download sitemap.xml
            </Button>
            <Button 
              icon={<FileText size={16} />} 
              href="/sitemap.xml" 
              target="_blank"
            >
              View Sitemap
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Edit>
  );
};
