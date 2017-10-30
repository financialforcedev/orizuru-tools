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
	chai = require('chai'),
	chaiAsPromised = require('chai-as-promised'),
	root = require('app-root-path'),
	sinon = require('sinon'),
	sinonChai = require('sinon-chai'),

	conn = require(root + '/src/lib/service/deploy/shared/connection'),
	certificate = require(root + '/src/lib/service/deploy/certificate'),
	connectedApp = require(root + '/src/lib/service/deploy/connectedApp'),
	heroku = require(root + '/src/lib/service/deploy/heroku'),
	sfdx = require(root + '/src/lib/service/deploy/sfdx'),
	logger = require(root + '/src/lib/util/logger'),

	service = require(root + '/src/lib/service/connectedApp'),

	expect = chai.expect,

	sandbox = sinon.sandbox.create();

chai.use(chaiAsPromised);
chai.use(sinonChai);

describe('service/connectedApp.js', () => {

	afterEach(() => {
		sandbox.restore();
	});

	describe('create', () => {

		it('should call the correct functions', () => {

			// given
			sandbox.stub(logger, 'logStart');
			sandbox.stub(logger, 'logEvent');
			sandbox.stub(logger, 'logFinish');

			sandbox.stub(certificate, 'generate');

			sandbox.stub(conn, 'create');

			sandbox.stub(connectedApp, 'askQuestions');
			sandbox.stub(connectedApp, 'create');
			sandbox.stub(connectedApp, 'updateHerokuConfigVariables');

			sandbox.stub(heroku, 'getAllApps');
			sandbox.stub(heroku, 'selectApp');

			sandbox.stub(sfdx, 'getAllScratchOrgs');
			sandbox.stub(sfdx, 'getConnectionDetails');
			sandbox.stub(sfdx, 'selectApp');

			// when - then
			return expect(service.create())
				.to.eventually.be.fulfilled
				.then(() => {

					expect(logger.logStart).to.have.been.calledOnce;
					expect(logger.logEvent).to.have.been.callCount(7);
					expect(logger.logFinish).to.have.been.calledOnce;

					expect(certificate.generate).to.have.been.calledOnce;

					expect(conn.create).to.have.been.calledOnce;

					expect(connectedApp.askQuestions).to.have.been.calledOnce;
					expect(connectedApp.create).to.have.been.calledOnce;
					expect(connectedApp.updateHerokuConfigVariables).to.have.been.calledOnce;

					expect(heroku.getAllApps).to.have.been.calledOnce;
					expect(heroku.selectApp).to.have.been.calledOnce;

					expect(sfdx.getAllScratchOrgs).to.have.been.calledOnce;
					expect(sfdx.getConnectionDetails).to.have.been.calledOnce;
					expect(sfdx.selectApp).to.have.been.calledOnce;

				});

		});

	});

});
