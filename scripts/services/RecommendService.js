define([
    'angular',
    'services/JsonRpcService'
], function (angular) {
    angular.module('xwWeb')
        .$register.factory('recommendService', recommendService);

    recommendService.$inject = ['jsonRpcService'];

    function recommendService(jsonRpcService) {
        return {
            getList: getList,//推荐列表
            get: get,//推荐详情
            match: match,//匹配推荐
            add: add, //添加推荐
            matchResRecommendation:matchResRecommendation,//获取消费的推荐
            addResRecommendation: addResRecommendation,//添加消费的推荐
            getStatisticsOfTransferSiting:getStatisticsOfTransferSiting,//找店，转店推荐次数
            getListOfMiddleman: getListOfMiddleman, //按照条件查询推荐人的推荐列表
            getListOfService: getListOfService,//客服获取转店找店服务推荐列表
            getRecommendInfo: getRecommendInfo,//获取推荐详情
            checkRecommend: checkRecommend//处理推荐
        }

        function getStatisticsOfTransferSiting(sessionId,oppId){
            return jsonRpcService.request('recommendation_getStatisticsOfTransferSiting', {
                sessionId: sessionId,
                resourceId: oppId
            })
        }
        function getList(sessionId, businessId, pageNo, pageSize) {
            return jsonRpcService.request('recommendation_getListOfSalesman', {
                sessionId: sessionId,
                businessId: businessId,
                pageNo: pageNo,
                pageSize: pageSize
            })
        }

        function get(sessionId, id) {
            return jsonRpcService.request('recommendation_get', {
                sessionId: sessionId,
                id: id
            })
        }

        function match(sessionId, requirementId, status, mobile, pageNo, pageSize) {
            return jsonRpcService.request('recommendation_match', {
                sessionId: sessionId,
                requirementId: requirementId,
                status: status,
                mobile: mobile,
                pageNo: pageNo,
                pageSize: pageSize
            })
        }

        function add(sessionId, resourceId, serviceId) {
            return jsonRpcService.request('recommendation_add', {
                sessionId: sessionId,
                resourceId: resourceId,
                serviceId: serviceId
            })
        }

        function matchResRecommendation(sessionId, shopId, status, mobile, pageNo, pageSize) {
            return jsonRpcService.request('recommendation_matchResRecommendation', {
                sessionId: sessionId,
                shopId:shopId,
                status: status,
                mobile: mobile,
                pageNo: pageNo,
                pageSize: pageSize
            })
        }

        function addResRecommendation(sessionId, resourceId, shopId, preferenceId) {
            return jsonRpcService.request('recommendation_addResRecommendation', {
                sessionId: sessionId,
                resourceId: resourceId,
                shopId: shopId,
                preferenceId: preferenceId
            })
        }

        function getListOfMiddleman(sessionId, resourceId, serviceType, statusCategory, pageNo, pageSize) {
            return jsonRpcService.request('recommendation_getListOfMiddleman', {
                sessionId: sessionId,
                resourceId: resourceId,
                serviceType: serviceType,
                statusCategory: statusCategory,
                pageNo: pageNo,
                pageSize: pageSize
            })
        }

        function getListOfService(sessionId, serviceId, checkStatus, pageNo, pageSize, cursor) {
            return jsonRpcService.request('recommendation_getListOfService', {
                sessionId: sessionId,
                serviceId: serviceId,
                checkStatus: checkStatus,
                pageNo: pageNo,
                pageSize: pageSize,
                cursor: cursor
            })
        }

        function getRecommendInfo(sessionId, id) {
            return jsonRpcService.request('recommendation_getInfo', {
                sessionId: sessionId,
                id: id
            })
        }

        function checkRecommend(sessionId, id, handle, reason) {
            return jsonRpcService.request('recommendation_check', {
                sessionId: sessionId,
                id: id,
                handle: handle,
                reason: reason
            })
        }


    }
});
