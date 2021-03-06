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

'use strict';

const
	chai = require('chai'),
	sinon = require('sinon'),
	sinonChai = require('sinon-chai'),

	jsforce = require('jsforce'),

	connection = require('../../../../lib/service/deploy/shared/connection'),

	expect = chai.expect;

chai.use(sinonChai);

describe('service/deploy/shared/connection.js', () => {

	let connectionStub;

	beforeEach(() => {
		connectionStub = sinon.createStubInstance(jsforce.Connection);
		sinon.stub(jsforce, 'Connection').returns(connectionStub);
	});

	afterEach(() => {
		sinon.restore();
	});

	describe('create', () => {

		it('should create a jsforce connection', () => {

			// Given
			const
				expectedInput = {
					parameters: {
						sfdx: {
							org: {
								credentials: {
									accessToken: 'testAccessToken',
									instanceUrl: 'testInstanceUrl'
								}
							}
						}
					}
				},

				// When
				result = connection.create(expectedInput);

			// Then
			expect(result).to.eql({
				conn: connectionStub,
				parameters: expectedInput.parameters
			});
			expect(jsforce.Connection).to.have.been.calledWithNew;
			expect(jsforce.Connection).to.have.been.calledWith(expectedInput.parameters.sfdx.org.credentials);

		});

	});

});
