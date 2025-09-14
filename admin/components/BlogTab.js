import React from 'react';
import { sharedStyles } from './shared-styles';

export default function BlogTab() {
  return (
    <>
      <style jsx>{sharedStyles}</style>
      <div className="blog-section">
        <h2>博客管理</h2>
        <div className="content-placeholder">
          <p>这里是博客管理功能的内容区域。</p>
          <p>您可以在这里上传和管理店铺日常博客内容。</p>
          <p>功能包括：</p>
          <ul>
            <li>博客文章发布与编辑</li>
            <li>图片上传与管理</li>
            <li>文章分类与标签</li>
            <li>发布状态管理</li>
            <li>博客预览与发布</li>
          </ul>
          <div className="action-buttons">
            <button className="primary-btn">新建博客</button>
            <button className="secondary-btn">管理现有博客</button>
          </div>
        </div>
      </div>
    </>
  );
}
