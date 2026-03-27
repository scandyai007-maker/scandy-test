import React, { useEffect } from "react";
import { EditButton, Edit, useForm } from "@refinedev/antd";
import { Form, Input, Button, Space, Divider } from "antd";
import { Download, FileText } from "lucide-react";
import { ImageUpload } from "../components/ImageUpload";


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

        {/* ── Basic Site Identity ── */}
        <Divider orientation="left" style={{ fontSize: '16px', fontWeight: 600 }}>Site Identity</Divider>
        <Form.Item label="Site Name" name="site_name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Favicon URL" name="favicon_url" extra="URL to your site's favicon (.ico or .png). Displays in browser tabs.">
          <ImageUpload />
        </Form.Item>

        {/* ── Core SEO Meta Tags ── */}
        <Divider orientation="left" style={{ fontSize: '16px', fontWeight: 600 }}>SEO Meta Tags</Divider>
        <Form.Item label="Global SEO Title" name="seo_title" rules={[{ required: true }]} extra="The default <title> shown in browser tabs and search engine results.">
          <Input />
        </Form.Item>
        <Form.Item label="Global Meta Description" name="seo_description" rules={[{ required: true }]} extra="Displayed beneath the title in search results. Keep under 160 characters.">
          <Input.TextArea rows={3} showCount maxLength={160} />
        </Form.Item>
        <Form.Item label="Global Meta Keywords" name="seo_keywords" rules={[{ required: true }]} extra="Comma-separated keywords for search engines.">
          <Input />
        </Form.Item>

        {/* ── Open Graph / Social Sharing ── */}
        <Divider orientation="left" style={{ fontSize: '16px', fontWeight: 600 }}>Social Sharing (Open Graph)</Divider>
        <Form.Item label="Default OG Image" name="og_image_url" extra="Default image shown when pages are shared on social media (1200×630 recommended).">
          <ImageUpload />
        </Form.Item>
        <Form.Item label="Canonical Base URL" name="canonical_base_url" extra="Your site's production URL (e.g. https://trustrank.com). Used for canonical tags and OG URLs.">
          <Input placeholder="https://trustrank.com" />
        </Form.Item>

        {/* ── Search Engine Verification & Analytics ── */}
        <Divider orientation="left" style={{ fontSize: '16px', fontWeight: 600 }}>Analytics & Verification</Divider>
        <Form.Item label="Google Site Verification" name="google_site_verification" extra="The content value from Google Search Console's meta tag verification.">
          <Input placeholder="e.g. dGhpcyBpcyBub3QgYSByZWFsIHRva2Vu" />
        </Form.Item>
        <Form.Item label="Google Analytics ID" name="google_analytics_id" extra="Your GA4 Measurement ID (e.g. G-XXXXXXXXXX) or GTM ID (e.g. GTM-XXXXXXX).">
          <Input placeholder="G-XXXXXXXXXX" />
        </Form.Item>

        {/* ── Crawl Control ── */}
        <Divider orientation="left" style={{ fontSize: '16px', fontWeight: 600 }}>Crawl Control</Divider>
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

        {/* ── Footer ── */}
        <Divider orientation="left" style={{ fontSize: '16px', fontWeight: 600 }}>Footer</Divider>
        <Form.Item label="Copyright Text" name="footer_copyright" extra="Displayed in the site footer. Leave empty for default.">
          <Input placeholder="© 2026 TrustRank Analytics. All rights reserved." />
        </Form.Item>
        <Form.Item label="Footer Description" name="footer_description" extra="General description shown in the footer.">
          <Input.TextArea rows={3} placeholder="Independent, data-driven reviews and rankings for premium online platforms..." />
        </Form.Item>
        
        <Divider orientation="left" style={{ fontSize: '14px', fontWeight: 500 }}>Column Titles</Divider>
        <Space direction="horizontal" style={{ width: '100%', alignItems: 'flex-start' }} size="large">
          <Form.Item label="Column 1 Title (Rankings)" name="footer_column_1_title" style={{ flex: 1 }}>
            <Input placeholder="Rankings" />
          </Form.Item>
          <Form.Item label="Column 2 Title (Resources)" name="footer_column_2_title" style={{ flex: 1 }}>
            <Input placeholder="Resources" />
          </Form.Item>
          <Form.Item label="Column 3 Title (About Us)" name="footer_column_3_title" style={{ flex: 1 }}>
            <Input placeholder="About Us" />
          </Form.Item>
        </Space>

        <Divider orientation="left" style={{ fontSize: '14px', fontWeight: 500 }}>Column Links</Divider>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1 Links */}
          <div className="bg-gray-50/50 p-4 rounded-lg border border-gray-100">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Column 1 Links</h4>
            <Form.List name="footer_column_1_links">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item {...restField} name={[name, 'label']} rules={[{ required: true, message: 'Missing label' }]}>
                        <Input placeholder="Label" />
                      </Form.Item>
                      <Form.Item {...restField} name={[name, 'url']} rules={[{ required: true, message: 'Missing URL' }]}>
                        <Input placeholder="URL" />
                      </Form.Item>
                      <Button type="text" danger onClick={() => remove(name)}>Remove</Button>
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block>Add Link</Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </div>

          {/* Column 2 Links */}
          <div className="bg-gray-50/50 p-4 rounded-lg border border-gray-100">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Column 2 Links</h4>
            <Form.List name="footer_column_2_links">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item {...restField} name={[name, 'label']} rules={[{ required: true, message: 'Missing label' }]}>
                        <Input placeholder="Label" />
                      </Form.Item>
                      <Form.Item {...restField} name={[name, 'url']} rules={[{ required: true, message: 'Missing URL' }]}>
                        <Input placeholder="URL" />
                      </Form.Item>
                      <Button type="text" danger onClick={() => remove(name)}>Remove</Button>
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block>Add Link</Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </div>

          {/* Column 3 Links */}
          <div className="bg-gray-50/50 p-4 rounded-lg border border-gray-100">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Column 3 Links</h4>
            <Form.List name="footer_column_3_links">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item {...restField} name={[name, 'label']} rules={[{ required: true, message: 'Missing label' }]}>
                        <Input placeholder="Label" />
                      </Form.Item>
                      <Form.Item {...restField} name={[name, 'url']} rules={[{ required: true, message: 'Missing URL' }]}>
                        <Input placeholder="URL" />
                      </Form.Item>
                      <Button type="text" danger onClick={() => remove(name)}>Remove</Button>
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block>Add Link</Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </div>
        </div>
      </Form>
    </Edit>
  );
};
