import React from 'react';
import { Refine, Authenticated } from "@refinedev/core";
import { dataProvider } from "@refinedev/supabase";
import { AuthPage, ErrorComponent, ThemedLayout, ThemedSider, useNotificationProvider } from "@refinedev/antd";
import { ConfigProvider, App as AntdApp } from "antd";
import { Routes, Route, Outlet } from "react-router-dom";
import routerBindings, { NavigateToResource, CatchAllNavigate, UnsavedChangesNotifier, DocumentTitleHandler } from "@refinedev/react-router";

import { supabase } from "../lib/supabase";
import { authProvider } from "./authProvider";

import { 
  Gamepad2, 
  Newspaper, 
  Layers, 
  Tags, 
  Settings 
} from "lucide-react";

import { PlatformList, PlatformCreate, PlatformEdit } from "./resources/platforms";
import { NewsList, NewsCreate, NewsEdit } from "./resources/news";
import { SiteSettingsEdit } from "./resources/siteSettings";
import { CategoryList, CategoryCreate, CategoryEdit } from "./resources/categories";
import { TagList, TagCreate, TagEdit } from "./resources/tags";

export default function AdminApp() {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#f59e0b' } }}>
      <AntdApp>
        <Refine
          dataProvider={dataProvider(supabase)}
          authProvider={authProvider}
          routerProvider={routerBindings}
          notificationProvider={useNotificationProvider()}
          resources={[
            {
              name: "platforms",
              list: "/admin/platforms",
              create: "/admin/platforms/create",
              edit: "/admin/platforms/edit/:id",
              meta: { icon: <Gamepad2 size={18} /> }
            },
            {
              name: "news",
              list: "/admin/news",
              create: "/admin/news/create",
              edit: "/admin/news/edit/:id",
              meta: { icon: <Newspaper size={18} /> }
            },
            {
              name: "categories",
              list: "/admin/categories",
              create: "/admin/categories/create",
              edit: "/admin/categories/edit/:id",
              meta: { icon: <Layers size={18} /> }
            },
            {
              name: "tags",
              list: "/admin/tags",
              create: "/admin/tags/create",
              edit: "/admin/tags/edit/:id",
              meta: { icon: <Tags size={18} /> }
            },
            {
              name: "site_settings",
              list: "/admin/site_settings",
              meta: {
                label: "SEO Settings",
                icon: <Settings size={18} />
              }
            }
          ]}
          options={{
            syncWithLocation: true,
            warnWhenUnsavedChanges: true,
          }}
        >
          <Routes>
            <Route
              element={
                <Authenticated key="admin-protected" fallback={<CatchAllNavigate to="/admin/login" />}>
                  <ThemedLayout Sider={() => <ThemedSider />}>
                    <Outlet />
                  </ThemedLayout>
                </Authenticated>
              }
            >
              <Route index element={<NavigateToResource resource="platforms" />} />
              
              <Route path="platforms">
                <Route index element={<PlatformList />} />
                <Route path="create" element={<PlatformCreate />} />
                <Route path="edit/:id" element={<PlatformEdit />} />
              </Route>
              
              <Route path="news">
                <Route index element={<NewsList />} />
                <Route path="create" element={<NewsCreate />} />
                <Route path="edit/:id" element={<NewsEdit />} />
              </Route>

              <Route path="categories">
                <Route index element={<CategoryList />} />
                <Route path="create" element={<CategoryCreate />} />
                <Route path="edit/:id" element={<CategoryEdit />} />
              </Route>

              <Route path="tags">
                <Route index element={<TagList />} />
                <Route path="create" element={<TagCreate />} />
                <Route path="edit/:id" element={<TagEdit />} />
              </Route>

              <Route path="site_settings">
                <Route index element={<SiteSettingsEdit />} />
              </Route>

              <Route path="*" element={<ErrorComponent />} />
            </Route>

            <Route
              path="login"
              element={
                <Authenticated key="admin-auth" fallback={
                  <AuthPage 
                    type="login" 
                    title={
                      <div className="flex justify-center flex-col items-center">
                        <div className="text-amber-500 font-bold text-2xl font-display">GamePortal CMS</div>
                        <p className="text-gray-500 text-sm mt-1">Refine Admin Platform</p>
                      </div>
                    }
                  />
                }>
                  <NavigateToResource />
                </Authenticated>
              }
            />
          </Routes>
          <UnsavedChangesNotifier />
          <DocumentTitleHandler />
        </Refine>
      </AntdApp>
    </ConfigProvider>
  );
}
