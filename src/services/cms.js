import request from '../utils/request';

// --------------------------------公告栏----------------------------------------Notice

// 公告栏获取类别
export function fetchGetNoticeType(params) {
  return request(`/borrower/v1/borrow-cms/category/list-all?categoryCode=${params}`);
}
// 公告栏类别联动项目
export function fetchGetNoticeProject(params) {
  return request(`/borrower/v1/borrow-cms/project/list?categoryId=${params}`);
}
// 公告栏查询
export function fetchSearchNotice(params) {
  return request('/borrower/v1/borrow-cms/notice-list', { method: 'post', body: JSON.stringify(params) });
}
// 公告栏操作权限查询
export function fetchNoticeOperateAuth() {
  return request('/borrower/v1/borrow-cms/button-list');
}
// 删除公告
export function fetchDeleteNotice(params) {
  return request(`/borrower/v1/borrow-cms/article/${params}`, { method: 'delete' });
}
// 置顶公告
export function fetchTopNotice(params) {
  return request(`/borrower/v1/borrow-cms/article/top/${params.id}?top=${params.top}`, { method: 'post' });
}
// 收藏公告
export function fetchCollectNotice(params) {
  return request(`/borrower/v1/borrow-cms/article/collection/${params.id}`);
}
// -----------------------------------知识库--------------------------------Knowledge
// 知识库获取类别
export function fetchGetKnowledgeType(params) {
  return request(`/borrower/v1/borrow-cms/category/list-all?categoryCode=${params}`);
}
// 知识库类别联动项目
export function fetchGetKnowledgeProject(params) {
  return request(`/borrower/v1/borrow-cms/project/list?categoryId=${params}`);
}
// 知识库查询
export function fetchSearchKnowledge(params) {
  return request('/borrower/v1/borrow-cms/repository-list', { method: 'post', body: JSON.stringify(params) });
}
// 公告栏操作权限查询
export function fetchKnowledgeOperateAuth() {
  return request('/borrower/v1/borrow-cms/button-list');
}
// 删除知识
export function fetchDeleteKnowledge(params) {
  return request(`/borrower/v1/borrow-cms/article/${params}`, { method: 'delete' });
}
// 置顶知识
export function fetchTopKnowledge(params) {
  return request(`/borrower/v1/borrow-cms/article/top/${params.id}?top=${params.top}`, { method: 'post' });
}
// 收藏知识
export function fetchCollectKnowledge(params) {
  return request(`/borrower/v1/borrow-cms/article/collection/${params.id}`);
}
// ----------------------------我的收藏--------------------------------Collection
// 信息类别联动类别
export function fetchGetCollectionType(params) {
  return request(`/borrower/v1/borrow-cms/category/list-all?categoryCode=${params}`);
}
// 类别联动项目
export function fetchGetCollectionProject(params) {
  return request(`/borrower/v1/borrow-cms/project/list?categoryId=${params}`);
}
// 我的收藏查询
export function fetchSearchCollection(params) {
  return request('/borrower/v1/borrow-cms/collection-list', { method: 'post', body: JSON.stringify(params) });
}
// 取消收藏
export function fetchDeleteCollection(params) {
  return request(`/borrower/v1/borrow-cms/article/collection/${params}`);
}
// ----------------------------分类管理--------------------------------SortManage
// 获取分类管理列表
export function fetchGetSortList(params) {
  return request('/borrower/v1/borrow-cms/category/list-page', { method: 'post', body: JSON.stringify(params) });
}
// 删除分类
export function fetchDeleteSort(params) {
  return request(`/borrower/v1/borrow-cms/category/${params}`, { method: 'DELETE' });
}
// 编辑分类保存
export function fetchEditSort(params) {
  return request(`/borrower/v1/borrow-cms/category/${params.id}`, { method: 'post', body: JSON.stringify(params) });
}
// 新增分类保存
export function fetchAddSort(params) {
  return request('/borrower/v1/borrow-cms/category', { method: 'post', body: JSON.stringify(params) });
}
// ----------------------------项目管理--------------------------------ProjectManage
// 获取项目管理列表
export function fetchGetProjectList(params) {
  return request('/borrower/v1/borrow-cms/category/list-page', { method: 'post', body: JSON.stringify(params) });
}
export function fetchGetProjectType(params) {
  return request(`/borrower/v1/borrow-cms/category/list-all?categoryCode=${params}`);
}
// 删除项目
export function fetchDeleteProject(params) {
  return request(`/borrower/v1/borrow-cms/category/${params}`, { method: 'DELETE' });
}
// 编辑项目保存
export function fetchEditProject(params) {
  return request(`/borrower/v1/borrow-cms/category/${params.id}`, { method: 'post', body: JSON.stringify(params) });
}
// 新增项目保存
export function fetchAddProject(params) {
  return request('/borrower/v1/borrow-cms/category', { method: 'post', body: JSON.stringify(params) });
}

export function getArticleDetail(params) {
  return request(`/borrower/v1/borrow-cms/article/${params}`);
}

export function getColumnList(params) {
  return request(`/borrower/v1/borrow-cms/category/list-all?categoryCode=${params}`);
}

export function getProjectList(params) {
  return request(`/borrower/v1/borrow-cms/project/list?categoryId=${params}`);
}

export function getGroups() {
  return request('/borrower/v1/borrow-cms/groups');
}

export function addGroup(params) {
  return request('/borrower/v1/borrow-cms/group', { method: 'POST', body: JSON.stringify(params) });
}

export function saveInfo(params) {
  return request(`/borrower/v1/borrow-cms/article/${params.id}`, { method: 'POST', body: JSON.stringify(params.value) });
}

export function addArticle(params) {
  return request('/borrower/v1/borrow-cms/article', { method: 'POST', body: JSON.stringify(params) });
}

export function getGroupList(params) {
  return request('/borrower/v1/borrow-cms/group/list-page ', { method: 'POST', body: JSON.stringify(params) });
}

export function getTagList() {
  return request('/borrower/v1/borrow-cms/group-list');
}

export function addTag(params) {
  return request('/borrower/v1/borrow-cms/group', { method: 'POST', body: JSON.stringify(params) });
}

export function editGroup(params) {
  return request('/borrower/v1/borrow-cms/group', { method: 'PUT', body: JSON.stringify(params) });
}
