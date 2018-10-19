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
	proxyquire = require('proxyquire').noCallThru(),
	sinon = require('sinon'),
	sinonChai = require('sinon-chai'),

	expect = chai.expect,

	schemas = require('../lib/boilerplate/schema'),
	handlers = require('../lib/boilerplate/handler'),
	read = require('../lib/boilerplate/read'),
	defaultTransport = require('../lib/boilerplate/transport'),
	orizuru = require('@financialforcedev/orizuru');

chai.use(sinonChai);

describe('worker.js', () => {

	let handleSpy, throngStub;

	beforeEach(() => {
		handleSpy = sinon.spy();
		throngStub = sinon.stub();
		sinon.stub(orizuru, 'Handler').callsFake(function () {
			this.handle = handleSpy;
		});
		sinon.stub(read, 'readSchema').returns({ mock: true });
		sinon.stub(read, 'readHandler').returns({ mockHandler: true });
		sinon.stub(schemas, 'getWorkerSchemas');
		sinon.stub(handlers, 'get');
		orizuru.Handler.emitter = {
			on: sinon.stub()
		};
	});

	afterEach(() => {
		delete require.cache[require.resolve('../lib/worker')];
		delete process.env.WEB_CONCURRENCY;

		sinon.restore();
	});

	it('should create an orizuru handler', () => {

		// given
		schemas.getWorkerSchemas.returns({
			test1: {
				incoming: {
					path: 'api/test1_incoming.avsc',
					sharedPath: '/api',
					fileName: 'test1'
				},
				outgoing: {
					path: 'api/test1_outgoing.avsc',
					sharedPath: '/api',
					fileName: 'test1'
				}
			},
			test2: {
				incoming: {
					path: 'api/test2_incoming.avsc',
					sharedPath: '/api',
					fileName: 'test2'
				}
			}
		});

		handlers.get.returns([{
			path: 'api/test1.js',
			sharedPath: '/api',
			fileName: 'test1'
		}, {
			path: 'api/test2.js',
			sharedPath: '/api',
			fileName: 'test2'
		}]);

		// when
		require('../lib/worker');

		// then
		expect(orizuru.Handler).to.have.been.calledOnce;
		expect(orizuru.Handler).to.have.been.calledWithNew;
		expect(orizuru.Handler).to.have.been.calledWith(defaultTransport);

		expect(handleSpy).to.have.been.calledTwice;
		expect(handleSpy).to.have.been.calledWith({
			schema: { mock: true },
			callback: { mockHandler: true }
		});
		expect(handleSpy).to.have.been.calledWith({
			schema: { mock: true },
			callback: { mockHandler: true }
		});

	});

	it('should create an orizuru handler cluster', () => {

		// given

		throngStub = sinon.stub();
		throngStub.yields();
		process.env.WEB_CONCURRENCY = 2;

		schemas.getWorkerSchemas.returns({
			test1: {
				incoming: {
					path: 'api/test1_incoming.avsc',
					sharedPath: '/api',
					fileName: 'test1'
				}
			},
			test2: {
				incoming: {
					path: 'api/test2_incoming.avsc',
					sharedPath: '/api',
					fileName: 'test2'
				}
			}
		});

		handlers.get.returns([{
			path: 'api/test1.js',
			sharedPath: '/api',
			fileName: 'test1'
		}, {
			path: 'api/test2.js',
			sharedPath: '/api',
			fileName: 'test2'
		}]);

		// when
		proxyquire('../lib/worker', {
			throng: throngStub
		});

		// then
		expect(orizuru.Handler).to.have.been.calledOnce;
		expect(orizuru.Handler).to.have.been.calledWithNew;
		expect(orizuru.Handler).to.have.been.calledWith(defaultTransport);

		expect(handleSpy).to.have.been.calledTwice;
		expect(handleSpy).to.have.been.calledWith({
			schema: { mock: true },
			callback: { mockHandler: true }
		});
		expect(handleSpy).to.have.been.calledWith({
			schema: { mock: true },
			callback: { mockHandler: true }
		});

		expect(throngStub).to.have.been.calledOnce;
		expect(throngStub).to.have.been.calledWith('2', sinon.match.any);

	});

	it('should not register a handler if no handler for a schema exists', () => {

		// given
		schemas.getWorkerSchemas.returns({
			test1: {
				incoming: {
					path: 'api/test1_incoming.avsc',
					sharedPath: '/api',
					fileName: 'test1'
				}
			}
		});

		handlers.get.returns([{
			path: 'api/test1.js',
			sharedPath: '/api',
			fileName: 'test1'
		}, {
			path: 'api/test2.js',
			sharedPath: '/api',
			fileName: 'test2'
		}]);

		// when
		require('../lib/worker');

		// then
		expect(orizuru.Handler).to.have.been.calledOnce;
		expect(orizuru.Handler).to.have.been.calledWithNew;
		expect(orizuru.Handler).to.have.been.calledWith(defaultTransport);

		expect(handleSpy).to.have.been.calledOnce;
		expect(handleSpy).to.have.been.calledWith({
			schema: { mock: true },
			callback: { mockHandler: true }
		});

	});

	it('should not register a handler if schema for a handler exists', () => {

		// given
		schemas.getWorkerSchemas.returns({
			test1: {
				incoming: {
					path: 'api/test1_incoming.avsc',
					sharedPath: '/api',
					fileName: 'test1'
				}
			},
			test2: {
				incoming: {
					path: 'api/test2_incoming.avsc',
					sharedPath: '/api',
					fileName: 'test2'
				}
			}
		});

		handlers.get.returns([{
			path: 'api/test1.js',
			sharedPath: '/api',
			fileName: 'test1'
		}]);

		// when
		require('../lib/worker');

		// then
		expect(orizuru.Handler).to.have.been.calledOnce;
		expect(orizuru.Handler).to.have.been.calledWithNew;
		expect(orizuru.Handler).to.have.been.calledWith(defaultTransport);

		expect(handleSpy).to.have.been.calledOnce;
		expect(handleSpy).to.have.been.calledWith({
			schema: { mock: true },
			callback: { mockHandler: true }
		});

	});

});
