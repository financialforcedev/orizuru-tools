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
	chaiAsPromised = require('chai-as-promised'),
	root = require('app-root-path'),
	sinon = require('sinon'),
	sinonChai = require('sinon-chai'),
	proxyquire = require('proxyquire'),

	expect = chai.expect;

chai.use(chaiAsPromised);
chai.use(sinonChai);

describe('service/deploy/shared/config.js', () => {

	let mocks, configFile;

	beforeEach(() => {

		mocks = {};

		mocks.fsextra = {};
		mocks.fsextra.mkdirp = sinon.stub();
		mocks.fsextra.writeJSON = sinon.stub();

		mocks.fsextra.readJSON = sinon.stub();

		configFile = proxyquire(root + '/src/lib/service/deploy/shared/config.js', {
			'fs-extra': mocks.fsextra
		});

	});

	afterEach(() => {
		sinon.restore();
	});

	describe('createFile', () => {

		it('should create the Orizuru config file', () => {

			// given
			const
				expectedCwd = '/Users/Joe/GIT/orizuru-tools',
				expectedOutput = {
					file: expectedCwd + '/.orizuru/config.json'
				};

			sinon.stub(process, 'cwd').returns(expectedCwd);
			mocks.fsextra.mkdirp.resolves();
			mocks.fsextra.writeJSON.resolves();

			// when - then
			return expect(configFile.createFile())
				.to.eventually.eql(expectedOutput)
				.then(() => {
					expect(mocks.fsextra.mkdirp).to.have.been.calledOnce;
					expect(mocks.fsextra.writeJSON).to.have.been.calledOnce;
				});

		});

	});

	describe('readSettings', () => {

		it('should create the Orizuru config file if the file does not exist', () => {

			// given
			const
				expectedCwd = '/Users/Joe/GIT/orizuru-tools',
				expectedOutput = {
					file: expectedCwd + '/.orizuru/config.json',
					orizuru: {}
				};

			sinon.stub(process, 'cwd').returns(expectedCwd);

			mocks.fsextra.mkdirp.resolves();
			mocks.fsextra.writeJSON.resolves();
			mocks.fsextra.readJSON.rejects();

			// when - then
			return expect(configFile.readSettings())
				.to.eventually.eql(expectedOutput)
				.then(() => {
					expect(mocks.fsextra.mkdirp).to.have.been.calledOnce;
					expect(mocks.fsextra.readJSON).to.have.been.calledOnce;
					expect(mocks.fsextra.writeJSON).to.have.been.calledOnce;
				});

		});

		it('should read the Orizuru config file if the file exists', () => {

			// given
			const
				expectedCwd = '/Users/Joe/GIT/orizuru-tools',
				expectedOutput = {
					file: expectedCwd + '/.orizuru/config.json',
					orizuru: {}
				};

			sinon.stub(process, 'cwd').returns(expectedCwd);

			mocks.fsextra.mkdirp.resolves();
			mocks.fsextra.readJSON.resolves({});

			// when - then
			return expect(configFile.readSettings())
				.to.eventually.eql(expectedOutput)
				.then(() => {
					expect(mocks.fsextra.mkdirp).to.not.have.been.called;
					expect(mocks.fsextra.readJSON).to.have.been.calledOnce;
				});

		});

	});

	describe('writeSetting', () => {

		it('should create the Orizuru config file if the file does not exist and write the setting', () => {

			// given
			const
				expectedCwd = '/Users/Joe/GIT/orizuru-tools',
				expectedOutput = {
					file: expectedCwd + '/.orizuru/config.json',
					orizuru: {
						test: 'test'
					}
				};

			sinon.stub(process, 'cwd').returns(expectedCwd);

			mocks.fsextra.mkdirp.resolves();
			mocks.fsextra.writeJSON.resolves();
			mocks.fsextra.readJSON.rejects();

			// when - then
			return expect(configFile.writeSetting({}, 'test', 'test'))
				.to.eventually.eql(expectedOutput)
				.then(() => {
					expect(mocks.fsextra.mkdirp).to.have.been.calledOnce;
					expect(mocks.fsextra.readJSON).to.have.been.calledOnce;
					expect(mocks.fsextra.writeJSON).to.have.been.calledTwice;
				});

		});

		it('should add the setting if the file exist', () => {

			// given
			const
				expectedCwd = '/Users/Joe/GIT/orizuru-tools',
				expectedReadJsonOutput = {
					test: 'test'
				},
				expectedOutput = {
					file: expectedCwd + '/.orizuru/config.json',
					orizuru: {
						test: 'test',
						test2: {
							test3: 'test'
						}
					}
				};

			sinon.stub(process, 'cwd').returns(expectedCwd);

			mocks.fsextra.mkdirp.resolves();
			mocks.fsextra.writeJSON.resolves();
			mocks.fsextra.readJSON.resolves(expectedReadJsonOutput);

			// when - then
			return expect(configFile.writeSetting({}, 'test2.test3', 'test'))
				.to.eventually.eql(expectedOutput)
				.then(() => {
					expect(mocks.fsextra.mkdirp).to.not.have.been.called;
					expect(mocks.fsextra.readJSON).to.have.been.calledOnce;
					expect(mocks.fsextra.writeJSON).to.have.been.calledOnce;
				});

		});

	});

});
