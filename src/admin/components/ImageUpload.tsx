import React, { useState } from 'react';
import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { supabase } from '../../lib/supabase';

interface ImageUploadProps {
  value?: string;
  onChange?: (url: string) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange }) => {
  const [loading, setLoading] = useState(false);

  const customRequest = async ({ file, onSuccess, onError }: any) => {
    try {
      setLoading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from('images').getPublicUrl(filePath);
      
      if (onChange) {
        onChange(data.publicUrl);
      }
      onSuccess?.("ok");
    } catch (error: any) {
      message.error(error.message || 'Upload failed');
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Upload
      name="avatar"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      customRequest={customRequest}
      beforeUpload={(file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp' || file.type === 'image/gif';
        if (!isJpgOrPng) {
          message.error('You can only upload JPG/PNG/WEBP/GIF file!');
        }
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
          message.error('Image must smaller than 5MB!');
        }
        return isJpgOrPng && isLt5M;
      }}
    >
      {value ? (
        <img 
          src={value} 
          alt="uploaded" 
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} 
        />
      ) : (
        uploadButton
      )}
    </Upload>
  );
};
