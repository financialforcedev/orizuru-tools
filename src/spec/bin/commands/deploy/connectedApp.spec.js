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

	yargs = require('yargs'),

	constants = require('../../../../lib/bin/constants/constants'),

	service = require('../../../../lib/service/connectedApp'),
	connectedAppCommands = require('../../../../lib/bin/commands/deploy/connectedApp'),

	cli = require('../../../../lib/bin/commands/deploy/connectedApp'),

	expect = chai.expect;

chai.use(sinonChai);

describe('bin/commands/deploy/connectedApp.js', () => {

	beforeEach(() => {

		sinon.stub(constants, 'getCopyrightNotice').returns('(c)');

		sinon.stub(yargs, 'epilogue').returnsThis();
		sinon.stub(yargs, 'usage').returnsThis();

	});

	afterEach(() => {
		sinon.restore();
	});

	it('should create the cli', () => {

		// Given
		sinon.stub(service, 'create');

		// When
		cli.builder(yargs);

		// Then
		expect(yargs.epilogue).to.have.been.calledOnce;

		expect(yargs.epilogue).to.have.been.calledWith('(c)');
		expect(yargs.usage).to.have.been.calledWith('\nUsage: orizuru deploy connected-app');

	});

	it('should have a handler that calls the connectedApp service', () => {

		// Given
		const { handler } = connectedAppCommands;

		sinon.stub(service, 'create');

		// When
		handler('test');

		// Then
		expect(service.create).to.have.been.calledOnce;
		expect(service.create).to.have.been.calledWith({ argv: 'test' });

	});

});
