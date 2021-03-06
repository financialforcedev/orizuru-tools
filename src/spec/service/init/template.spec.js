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

	fs = require('fs-extra'),
	inquirer = require('inquirer'),

	template = require('../../../lib/service/init/template'),

	expect = chai.expect;

chai.use(sinonChai);

describe('service/init/template.js', () => {

	let lstatStub;

	beforeEach(() => {

		lstatStub = {
			isDirectory: sinon.stub()
		};

		sinon.stub(fs, 'lstatSync').returns(lstatStub);
		sinon.stub(fs, 'readdir');
		sinon.stub(fs, 'readJson');

		sinon.stub(inquirer, 'prompt');

	});

	afterEach(() => {
		sinon.restore();
	});

	it('should use the template from the command line argument if the provided template exists', async () => {

		// Given
		const
			expectedTemplate = 'example-template',
			config = {
				argv: {
					template: expectedTemplate
				}
			},
			expectedPackageJson = {
				'package': {
					dependencies: {
						'@financialforcedev/orizuru': '^5.0.2'
					}
				}
			},
			expectedOutput = {
				argv: {
					template: expectedTemplate
				},
				availableTemplates: [
					expectedTemplate
				],
				selectedTemplate: {
					configuration: {
						file: expectedPackageJson,
						extensions: {}
					},
					folder: expectedTemplate,
					fullPath: process.cwd() + '/templates/' + expectedTemplate
				},
				templateFolder: `${process.cwd()}/templates`
			};

		lstatStub.isDirectory.returns(true);

		fs.readdir.resolves([
			expectedTemplate
		]);
		fs.readJson.resolves(expectedPackageJson);

		// When
		const output = await template.select(config);

		// Then
		expect(output).to.eql(expectedOutput);

		expect(inquirer.prompt).to.not.have.been.called;

	});

	it('should prompt the user for the template if the template provided from the command line does not exist', async () => {

		// Given
		const
			expectedTemplate = 'example-template',
			config = {
				argv: {
					template: 'missing-template'
				}
			},
			expectedPackageJson = {
				'package': {
					dependencies: {
						'@financialforcedev/orizuru': '^5.0.2'
					}
				}
			},
			expectedAnswer = {
				selectedTemplate: {
					folder: expectedTemplate
				}
			},
			expectedOutput = {
				argv: {
					template: 'missing-template'
				},
				availableTemplates: [
					expectedTemplate
				],
				selectedTemplate: {
					configuration: {
						file: expectedPackageJson,
						extensions: {}
					},
					folder: expectedTemplate,
					fullPath: `${process.cwd()}/templates/${expectedTemplate}`
				},
				templateFolder: `${process.cwd()}/templates`
			};

		lstatStub.isDirectory.returns(true);

		fs.readdir.resolves([
			expectedTemplate
		]);
		fs.readJson.resolves(expectedPackageJson);
		inquirer.prompt.resolves(expectedAnswer);

		// When
		const output = await template.select(config);

		// Then
		expect(output).to.eql(expectedOutput);
		expect(inquirer.prompt).to.have.been.calledOnce;

	});

	it('should read any extension configuration files', async () => {

		// Given
		const
			expectedTemplate = 'example-template',
			config = {},
			expectedPackageJson = {
				'extends': [
					'test'
				],
				'package': {
					dependencies: {
						'@financialforcedev/orizuru': '^5.0.5'
					}
				}
			},
			expectedExtensionPackageJson = {
				'package': {
					dependencies: {
						'@financialforcedev/orizuru': '^5.0.2'
					}
				}
			},
			expectedAnswer = {
				selectedTemplate: {
					folder: expectedTemplate
				}
			},
			expectedOutput = {
				availableTemplates: [
					expectedTemplate
				],
				selectedTemplate: {
					configuration: {
						file: expectedPackageJson,
						extensions: {
							test: expectedExtensionPackageJson
						}
					},
					folder: expectedTemplate,
					fullPath: process.cwd() + '/templates/' + expectedTemplate
				},
				templateFolder: `${process.cwd()}/templates`
			};

		lstatStub.isDirectory.returns(true);

		fs.readdir.resolves([
			expectedTemplate
		]);
		fs.readJson.onCall(0).resolves(expectedPackageJson);
		fs.readJson.onCall(1).resolves(expectedExtensionPackageJson);
		inquirer.prompt.resolves(expectedAnswer);

		// When
		const output = await template.select(config);

		// Then
		expect(output).to.eql(expectedOutput);
		expect(inquirer.prompt).to.have.been.calledOnce;

	});

});
