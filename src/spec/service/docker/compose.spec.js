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

	fs = require('fs'),
	path = require('path'),

	read = require('../../../lib/util/read'),
	shell = require('../../../lib/util/shell'),

	compose = require('../../../lib/service/docker/compose'),

	expect = chai.expect;

chai.use(sinonChai);

describe('service/docker/compose', () => {

	beforeEach(() => {

		sinon.stub(fs, 'readFileSync');
		sinon.stub(path, 'resolve');
		sinon.stub(read, 'findFilesWithExtension');
		sinon.stub(shell, 'executeCommands');

	});

	afterEach(() => {
		sinon.restore();
	});

	describe('getServices', () => {

		it('should read the services from a given yaml file', () => {

			// Given
			const
				expectedImageName = 'image',
				expectedYaml = 'version: \'3\'\nservices:\n  image:\n    testing';

			var services;

			fs.readFileSync.returns(expectedYaml);

			// When
			services = compose.getServices(expectedImageName);

			// Then
			expect(fs.readFileSync).to.have.been.calledOnce;
			expect(services).to.eql([expectedImageName]);

		});

	});

	describe('getAllServices', () => {

		it('should read the services from a given yaml files', async () => {

			// Given
			const
				expectedDockerComposeFile = 'docker.yaml',
				expectedYaml = 'version: \'3\'\nservices:\n  image:\n    testing',
				expectedInput = {},
				expectedOutput = {
					docker: {
						compose: {
							files: [expectedDockerComposeFile]
						},
						services: {
							image: expectedDockerComposeFile
						}
					}
				};

			read.findFilesWithExtension.returns([
				expectedDockerComposeFile
			]);

			fs.readFileSync.withArgs(expectedDockerComposeFile).returns(expectedYaml);
			path.resolve.returns(expectedDockerComposeFile);

			// When
			const output = await compose.getAllServices(expectedInput);

			// Then
			expect(output).to.eql(expectedOutput);
			expect(fs.readFileSync).to.have.been.calledOnce;
			expect(fs.readFileSync).to.have.been.calledWith(expectedDockerComposeFile);

		});

	});

	describe('buildImages', () => {

		it('should handle no selected services', () => {

			// When/then
			expect(() => {
				compose.buildImages([]);
			}).to.throw('No services selected');

		});

		it('should call shell executeCommands', async () => {

			// Given
			const
				expectedCommands = [{
					args: ['-f', 'test1.yml', 'build', 'image1'],
					cmd: 'docker-compose',
					opts: {
						logging: {
							start: 'Build image: image1',
							finish: 'Built image: image1'
						},
						namespace: 'docker'
					}
				}, {
					args: ['-f', 'test2.yml', 'build', 'image2'],
					cmd: 'docker-compose',
					opts: {
						logging: {
							start: 'Build image: image2',
							finish: 'Built image: image2'
						},
						namespace: 'docker'
					}
				}],
				expectedServices = { image1: 'test1.yml', image2: 'test2.yml' },
				expectedInput = {
					docker: {
						selected: {
							services: expectedServices
						}
					}
				};

			shell.executeCommands.resolves();

			// When
			await compose.buildImages(expectedInput);

			// Then
			expect(shell.executeCommands).to.have.been.calledOnce;
			expect(shell.executeCommands).to.have.been.calledWith(expectedCommands, {}, expectedInput);

		});

	});

	describe('up', () => {

		it('should handle no selected services', () => {

			// When/then
			expect(() => {
				compose.up({});
			}).to.throw('No services selected');

		});

		it('should call shell executeCommands', async () => {

			// Given
			const
				expectedCommands = [{
					args: ['-f', 'test1.yml', 'up', '-d', 'image1'],
					cmd: 'docker-compose',
					opts: {
						logging: {
							start: 'Start service: image1',
							finish: 'Started service: image1'
						},
						namespace: 'docker'
					}
				}, {
					args: ['-f', 'test2.yml', 'up', '-d', 'image2'],
					cmd: 'docker-compose',
					opts: {
						logging: {
							start: 'Start service: image2',
							finish: 'Started service: image2'
						},
						namespace: 'docker'
					}
				}],
				expectedServices = { image1: 'test1.yml', image2: 'test2.yml' },
				expectedInput = {
					docker: {
						selected: {
							services: expectedServices
						}
					}
				};

			shell.executeCommands.resolves();

			// When
			await compose.up(expectedInput);

			// Then
			expect(shell.executeCommands).to.have.been.calledOnce;
			expect(shell.executeCommands).to.have.been.calledWith(expectedCommands, {}, expectedInput);

		});

	});

});
