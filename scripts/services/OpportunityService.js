/**
 * Created by Leo Long on 2016/4/19.
 */
define([
    'angular',
    'services/JsonRpcService'
], function(angular) {
    'use strict';

    OpportunityService.$inject = ['jsonRpcService'];
    return angular.module('xwWeb')
        .$register.factory('OpportunityService', OpportunityService);

    function OpportunityService(jsonRpcService) {
        return {
            getList : getList,
            getInfo : getInfo,
            search : search,
            query : query
        };

        function query(sessionId,queryParam,pageNo,pageSize){
            return jsonRpcService.request('opportunity_oppQuery', {
                sessionId: sessionId,
                queryParam: queryParam,
                pageNo: pageNo,
                pageSize: pageSize
            })
        }

        function search(sessionId,key,pageNo, pageSize) {
            return jsonRpcService.request('opportunity_searchOpp', {
                sessionId: sessionId,
                key: key,
                pageNo: pageNo,
                pageSize: pageSize
            })
        }

        function getList(sessionId, validity, pageNo, pageSize) {
            return jsonRpcService.request('opportunity_list', {
                sessionId: sessionId,
                validity: validity,
                pageNo: pageNo,
                pageSize: pageSize
            })
        }

        function getInfo(sessionId,opportunityId){
            return jsonRpcService.request('opportunity_getInfo', {
                sessionId: sessionId,
                opportunityId: opportunityId
            })
        }

    }
});
