/**
 * Copyright (c) 2017, FinancialForce.com, inc
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
 **/

'use strict';

const
	root = require('app-root-path'),
	chai = require('chai'),
	proxyquire = require('proxyquire'),
	sinon = require('sinon'),
	sinonChai = require('sinon-chai'),

	expect = chai.expect,

	COPYRIGHT_NOTICE = require(root + '/src/lib/bin/constants/constants').COPYRIGHT_NOTICE,

	service = require(root + '/src/lib/service/deploy/certificate'),
	certificateCommands = require(root + '/src/lib/bin/commands/deploy/certificate'),

	sandbox = sinon.sandbox.create();

chai.use(sinonChai);

describe('bin/commands/deploy/certificate.js', () => {

	let mocks;

	afterEach(() => {
		sandbox.restore();
	});

	it('should create the cli', () => {

		// given
		mocks = {};
		mocks.yargs = {};
		mocks.yargs.epilogue = sandbox.stub().returns(mocks.yargs);
		mocks.yargs.usage = sandbox.stub().returns(mocks.yargs);

		sandbox.stub(service, 'generate');

		const cli = proxyquire(root + '/src/lib/bin/commands/deploy/certificate', {
			yargs: mocks.yargs
		});

		// when
		cli.builder(mocks.yargs);

		//then
		expect(mocks.yargs.epilogue).to.have.been.calledOnce;

		expect(mocks.yargs.epilogue).to.have.been.calledWith(COPYRIGHT_NOTICE);
		expect(mocks.yargs.usage).to.have.been.calledWith('\nUsage: orizuru deploy certificate');

	});

	it('should have a handler that calls the certificate service', () => {

		// given
		const { handler } = certificateCommands;

		sandbox.stub(service, 'generate');

		// when
		handler('test');

		// then
		expect(service.generate).to.have.been.calledOnce;
		expect(service.generate).to.have.been.calledWith({ argv: 'test' });

	});

});