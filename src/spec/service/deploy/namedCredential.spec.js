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

	inquirer = require('inquirer'),
	jsforce = require('jsforce'),

	namedCredential = require('../../../lib/service/deploy/namedCredential'),

	expect = chai.expect;

chai.use(sinonChai);

describe('service/deploy/namedCredential.js', () => {

	let connectionStub;

	beforeEach(() => {

		connectionStub = sinon.createStubInstance(jsforce.Connection);
		sinon.stub(jsforce, 'Connection').returns(connectionStub);

		sinon.stub(inquirer, 'prompt');

	});

	afterEach(() => {
		sinon.restore();
	});

	describe('askQuestions', () => {

		it('should ask the correct questions', async () => {

			// Given
			const
				expectedAnswers = {
					name: 'test'
				},
				expectedOutput = {
					parameters: {
						namedCredential: expectedAnswers
					}
				};

			inquirer.prompt.resolves(expectedAnswers);

			// When
			const result = await namedCredential.askQuestions({});

			// Then
			expect(result).to.eql(expectedOutput);

		});

	});

	describe('create', () => {

		it('should execute the correct commands', async () => {

			// Given
			const
				expectedInput = {
					conn: sinon.stub(),
					connectedApp: {
						name: 'testConnectedAppName'
					},
					parameters: {
						namedCredential: {
							name: 'testName'
						},
						heroku: {
							app: {
								['web_url']: 'testAppUrl'
							}
						}
					}
				},
				expectedOutput = expectedInput;

			expectedInput.conn.metadata = {};
			expectedInput.conn.metadata.upsert = sinon.stub().resolves();
			expectedInput.conn.metadata.read = sinon.stub().resolves();

			// When
			const result = await namedCredential.create(expectedInput);

			// Then
			expect(result).to.eql(expectedOutput);
			expect(expectedInput.conn.metadata.upsert).to.have.been.calledOnce;
			expect(expectedInput.conn.metadata.read).to.have.been.calledOnce;

		});

	});

});
