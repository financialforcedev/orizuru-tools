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

	service = require('../../../../lib/service/docker'),

	cli = require('../../../../lib/bin/commands/docker/listServices'),

	expect = chai.expect;

chai.use(sinonChai);

describe('bin/commands/docker/listServices.js', () => {

	beforeEach(() => {

		sinon.stub(constants, 'getCopyrightNotice').returns('(c)');

		sinon.stub(yargs, 'epilogue').returnsThis();
		sinon.stub(yargs, 'option').returnsThis();
		sinon.stub(yargs, 'usage').returnsThis();

	});

	afterEach(() => {
		sinon.restore();
	});

	it('should have the correct command, description and alias', () => {

		// Then
		expect(cli.command).to.eql('list-services');
		expect(cli.aliases).to.eql(['ls']);
		expect(cli.desc).to.eql('List all Docker services');

	});

	it('should create the cli', () => {

		// When
		cli.builder(yargs);

		// Then
		expect(yargs.epilogue).to.have.been.calledOnce;
		expect(yargs.option).to.have.been.calledTwice;
		expect(yargs.usage).to.have.been.calledOnce;

		expect(yargs.epilogue).to.have.been.calledWith('(c)');
		expect(yargs.option).to.have.been.calledWith('d', sinon.match.object);
		expect(yargs.option).to.have.been.calledWith('verbose', sinon.match.object);
		expect(yargs.usage).to.have.been.calledWith('\nUsage: orizuru docker list-services [OPTIONS]');

	});

	it('should call the handler', () => {

		// Given
		const
			expectedInput = { debug: true },
			expectedOutput = { argv: expectedInput };

		sinon.stub(service, 'listServices');

		// When
		cli.handler(expectedInput);

		// Then
		expect(service.listServices).to.have.been.calledOnce;
		expect(service.listServices).to.have.been.calledWith(expectedOutput);

	});

});
