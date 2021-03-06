/**
 * Copyright (c) 2017-2018, FinancialForce.com, inc
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 *   are permitted provided that the following conditions are met:
 *
 * - Redistributions of source code must retain the above copyright notice,
 *      this list of conditions and the following disclaimer.
 * - Redistributions in binary form must reproduce the above copyright notice,
 *      this list of conditions and the following disclaimer in the documentation
 *      and/or other materials provided with the distribution.
 * - Neither the name of the FinancialForce.com, inc nor the names of its contributors
 *      may be used to endorse or promote products derived from this software without
 *      specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 *  ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 *  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL
 *  THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
 *  OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 *  OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 *  ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

public with sharing class DeliveryRouteSelector
{
    @testVisible
    private static DeliveryRouteSelector instance = null;

    public static DeliveryRouteSelector newInstance()
    {
        if (instance == null)
        {
            instance = new DeliveryRouteSelector();
        }

        return instance;
    }

    public DeliveryRoute__c[] selectByIds(Set<Id> deliveryRouteIds)
    {
        if (deliveryRouteIds == null || deliveryRouteIds.size() == 0) {
            return new List<DeliveryRoute__c>();
        }
        return [
            SELECT Id, Name, DeliveryPlan__c, Vehicle__r.Id, Vehicle__r.Warehouse__r.Contact__r.MailingLatitude, Vehicle__r.Warehouse__r.Contact__r.MailingLongitude 
            FROM DeliveryRoute__c 
            WHERE Id IN :deliveryRouteIds
        ];
    }
    
	public DeliveryRoute__c[] selectByPlanIds(Set<Id> deliveryPlanIds)
    {
        if (deliveryPlanIds == null || deliveryPlanIds.size() == 0) {
            return new List<DeliveryRoute__c>();
        }
        return [
            SELECT Id, Name, DeliveryPlan__c, Vehicle__r.Id, Vehicle__r.Warehouse__r.Contact__r.MailingLatitude, Vehicle__r.Warehouse__r.Contact__r.MailingLongitude, Vehicle__r.Name, Vehicle__r.Warehouse__r.Name 
            FROM DeliveryRoute__c 
            WHERE DeliveryPlan__c IN :deliveryPlanIds
			ORDER BY Name
        ];
    }
	
}
