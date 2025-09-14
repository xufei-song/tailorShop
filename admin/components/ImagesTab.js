import React from 'react';
import { sharedStyles } from './shared-styles';

export default function ImagesTab() {
  return (
    <>
      <style jsx>{sharedStyles}</style>
      <div className="images-section">
        <h2>图片管理</h2>
        <div className="content-placeholder">
          <p>这里是图片管理功能的内容区域。</p>
          <p>您可以在这里上传和管理主页轮播图片。</p>
          <p>功能包括：</p>
          <ul>
            <li>轮播图片上传</li>
            <li>图片排序与编辑</li>
            <li>图片预览与删除</li>
            <li>图片尺寸优化</li>
            <li>轮播设置管理</li>
          </ul>
          <div className="action-buttons">
            <button className="primary-btn">上传新图片</button>
            <button className="secondary-btn">管理现有图片</button>
          </div>
        </div>
      </div>
    </>
  );
}
