/*
 * Copyright (c) 2017 FinancialForce.com, inc.  All rights reserved.
 *
 * This is a proof of concept.
 * It forms the basis of recommendations for architecture, patterns, dependencies, and has
 * some of the characteristics which will eventually be present in FF hybrid apps.
 *
 * However, it lacks important functionality and checks.
 * It does not conform to SOC1 or any other auditable process.
 *
 * We do not endorse any attempt to use this codebase as the blueprint for production code.
 */
'use strict';

const
	chai = require('chai'),
	chaiAsPromised = require('chai-as-promised'),
	proxyquire = require('proxyquire'),
	root = require('app-root-path'),
	sinon = require('sinon'),
	sinonChai = require('sinon-chai'),

	expect = chai.expect,

	dockerService = require(root + '/src/lib/service/docker/docker'),
	composeService = require(root + '/src/lib/service/docker/compose'),
	promptService = require(root + '/src/lib/service/docker/prompt'),

	sandbox = sinon.sandbox.create();

chai.use(chaiAsPromised);
chai.use(sinonChai);

describe('service/docker', () => {

	let docker, mocks;

	beforeEach(() => {

		mocks = {};
		mocks.logger = {};
		mocks.logger.logStart = sandbox.stub();
		mocks.logger.logError = sandbox.stub();
		mocks.logger.logFinish = sandbox.stub();

		mocks.listContainers = sandbox.stub();

		sandbox.stub(composeService, 'getAllServices');
		sandbox.stub(composeService, 'buildImages');
		sandbox.stub(composeService, 'up');

		sandbox.stub(promptService, 'getServicesForProcess');

		sandbox.stub(dockerService, 'displayLogs');
		sandbox.stub(dockerService, 'listContainers').returns(mocks.listContainers);
		sandbox.stub(dockerService, 'removeDanglingImages');
		sandbox.stub(dockerService, 'stopContainers');

		docker = proxyquire(root + '/src/lib/service/docker', {
			'../util/logger': mocks.logger
		});

	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('buildImage', () => {

		it('should catch errors', () => {

			// given
			const
				expectedServiceName = 'testService',
				expectedOptions = { _: ['d', 'bi', expectedServiceName] },
				expectedError = new Error('test');

			dockerService.removeDanglingImages.rejects(expectedError);

			// when/then
			return expect(docker.buildImage(expectedOptions))
				.to.eventually.be.fulfilled
				.then(() => {
					expect(dockerService.removeDanglingImages).to.have.been.calledOnce;
					expect(promptService.getServicesForProcess).to.have.been.calledOnce;
					expect(mocks.logger.logStart).to.have.been.calledOnce;
					expect(mocks.logger.logError).to.have.been.calledOnce;
					expect(composeService.getAllServices).to.not.have.been.called;
					expect(composeService.buildImages).to.not.have.been.called;
					expect(mocks.logger.logStart).to.have.been.calledWith('Building images');
					expect(mocks.logger.logError).to.have.been.calledWith(expectedError);
				});

		});

		it('should log build images failures', () => {

			// given
			const
				expectedServiceName = 'testService',
				expectedOptions = { _: ['d', 'bi', expectedServiceName] },
				expectedError = new Error('test'),
				services = {
					[expectedServiceName]: 'test1.yml'
				};

			composeService.buildImages.rejects(expectedError);
			composeService.getAllServices.resolves(services);
			promptService.getServicesForProcess.resolves(services);
			dockerService.removeDanglingImages.resolves();

			// when/then
			return expect(docker.buildImage(expectedOptions))
				.to.eventually.be.fulfilled
				.then(() => {
					expect(composeService.getAllServices).to.have.been.calledOnce;
					expect(dockerService.removeDanglingImages).to.have.been.calledOnce;
					expect(promptService.getServicesForProcess).to.have.been.calledOnce;
					expect(composeService.buildImages).to.have.been.calledOnce;
					expect(mocks.logger.logStart).to.have.been.calledOnce;
					expect(mocks.logger.logFinish).to.have.been.calledOnce;
					expect(promptService.getServicesForProcess).to.have.been.calledWith('Select services to build');
					expect(composeService.buildImages).to.have.been.calledWith(services);
					expect(mocks.logger.logStart).to.have.been.calledWith('Building images');
					expect(mocks.logger.logError).to.have.been.calledWith(expectedError);
				});

		});

		it('should build the image for the given service', () => {

			// given
			const
				expectedServiceName = 'testService',
				expectedOptions = { _: ['d', 'bi', expectedServiceName] },
				services = {
					[expectedServiceName]: 'test1.yml'
				};

			composeService.getAllServices.resolves(services);
			composeService.buildImages.resolves();
			promptService.getServicesForProcess.resolves(services);
			dockerService.removeDanglingImages.resolves();

			// when/then
			return expect(docker.buildImage(expectedOptions))
				.to.eventually.be.fulfilled
				.then(() => {
					expect(composeService.getAllServices).to.have.been.calledOnce;
					expect(dockerService.removeDanglingImages).to.have.been.calledOnce;
					expect(promptService.getServicesForProcess).to.have.been.calledOnce;
					expect(composeService.buildImages).to.have.been.calledOnce;
					expect(mocks.logger.logStart).to.have.been.calledOnce;
					expect(mocks.logger.logFinish).to.have.been.calledOnce;
					expect(promptService.getServicesForProcess).to.have.been.calledWith('Select services to build');
					expect(composeService.buildImages).to.have.been.calledWith(services);
					expect(mocks.logger.logStart).to.have.been.calledWith('Building images');
					expect(mocks.logger.logFinish).to.have.been.calledWith('Built images');
				});

		});

	});

	describe('displayLogs', () => {

		it('should catch errors', () => {

			// given
			const
				expectedOptions = { _: ['d', 'logs'] },
				expectedError = new Error('test'),
				services = { testService: 'test1.yml' };

			promptService.getServicesForProcess.resolves(services);
			dockerService.listContainers.rejects(expectedError);

			// when/then
			return expect(docker.displayLogs(expectedOptions))
				.to.eventually.be.fulfilled
				.then(() => {
					expect(dockerService.listContainers).to.have.been.calledOnce;
					expect(mocks.logger.logStart).to.have.been.calledOnce;
					expect(mocks.logger.logFinish).to.have.been.calledOnce;
					expect(promptService.getServicesForProcess).to.have.been.calledOnce;
					expect(dockerService.displayLogs).to.not.have.been.called;
					expect(promptService.getServicesForProcess).to.have.been.calledWith('Select services for which to display logs');
					expect(mocks.logger.logStart).to.have.been.calledWith('Displaying logs');
					expect(mocks.logger.logError).to.have.been.calledWith(expectedError);
				});

		});

		it('should display logs for the given service', () => {

			// given
			const
				expectedServiceName = 'testService',
				expectedOptions = { _: ['d', 'bi', expectedServiceName] },
				services = {
					[expectedServiceName]: 'test1.yml'
				};

			dockerService.listContainers.resolves([expectedServiceName]);
			dockerService.displayLogs.resolves();
			promptService.getServicesForProcess.resolves(services);

			// when/then
			return expect(docker.displayLogs(expectedOptions))
				.to.eventually.be.fulfilled
				.then(() => {
					expect(dockerService.listContainers).to.have.been.calledOnce;
					expect(promptService.getServicesForProcess).to.have.been.calledOnce;
					expect(dockerService.displayLogs).to.have.been.calledOnce;
					expect(mocks.logger.logStart).to.have.been.calledOnce;
					expect(mocks.logger.logFinish).to.have.been.calledOnce;
					expect(promptService.getServicesForProcess).to.have.been.calledWith('Select services for which to display logs');
					expect(mocks.logger.logStart).to.have.been.calledWith('Displaying logs');
					expect(mocks.logger.logFinish).to.have.been.calledWith('Displayed logs');
				});

		});

	});

	describe('listServices', () => {

		it('should list the services found in the Docker Compose files', () => {

			// given
			const expectedServices = {
				docker: {
					services: {
						image: 'file'
					}
				}
			};

			mocks.logger.logStart.returns(sandbox.stub());
			mocks.logger.logFinish.returns(sandbox.stub());

			composeService.getAllServices.resolves(expectedServices);

			// when/then
			return expect(docker.listServices({}))
				.to.eventually.be.fulfilled
				.then(() => {
					expect(mocks.logger.logStart).to.have.been.calledOnce;
					expect(mocks.logger.logFinish).to.have.been.calledOnce;
					expect(mocks.logger.logStart).to.have.been.calledWith('List services:');
					expect(mocks.logger.logFinish).to.have.been.calledWith('  image                                           file');
				});

		});

	});

	describe('reset', () => {

		it('should handle errors', () => {

			// given
			const expectedError = new Error('test');

			mocks.listContainers.rejects(expectedError);

			// when/then
			return expect(docker.reset({}))
				.to.eventually.be.fulfilled
				.then(() => {
					expect(dockerService.listContainers).to.have.been.calledTwice;
					expect(mocks.logger.logStart).to.have.been.calledOnce;
					expect(mocks.logger.logFinish).to.have.been.calledOnce;
					expect(mocks.logger.logStart).to.have.been.calledWith('Removing all containers and images');
					expect(mocks.logger.logError).to.have.been.calledWith(expectedError);
				});

		});

	});

	describe('startServices', () => {

		it('should catch errors', () => {

			// given
			const
				expectedServiceName = 'testService',
				expectedOptions = { _: ['d', 's', expectedServiceName] },
				expectedError = new Error('test');

			dockerService.removeDanglingImages.rejects(expectedError);

			// when/then
			return expect(docker.startServices(expectedOptions))
				.to.eventually.be.fulfilled
				.then(() => {
					expect(dockerService.removeDanglingImages).to.have.been.calledOnce;
					expect(promptService.getServicesForProcess).to.have.been.calledOnce;
					expect(mocks.logger.logStart).to.have.been.calledOnce;
					expect(mocks.logger.logFinish).to.have.been.calledOnce;
					expect(composeService.up).to.not.have.been.called;
					expect(composeService.getAllServices).to.not.have.been.called;
					expect(mocks.logger.logStart).to.have.been.calledWith('Start services');
					expect(mocks.logger.logError).to.have.been.calledWith(expectedError);
				});

		});

		it('should log Docker compose up failures', () => {

			// given
			const
				expectedServiceName = 'testService',
				expectedOptions = { _: ['d', 's', expectedServiceName] },
				expectedError = new Error('test'),
				services = {
					[expectedServiceName]: 'test1.yml'
				};

			composeService.getAllServices.resolves(services);
			composeService.up.rejects(expectedError);
			promptService.getServicesForProcess.resolves(services);
			dockerService.removeDanglingImages.resolves();

			// when/then
			return expect(docker.startServices(expectedOptions))
				.to.eventually.be.fulfilled
				.then(() => {
					expect(composeService.getAllServices).to.have.been.calledOnce;
					expect(dockerService.removeDanglingImages).to.have.been.calledOnce;
					expect(promptService.getServicesForProcess).to.have.been.calledOnce;
					expect(composeService.up).to.have.been.calledOnce;
					expect(mocks.logger.logStart).to.have.been.calledOnce;
					expect(mocks.logger.logFinish).to.have.been.calledOnce;
					expect(promptService.getServicesForProcess).to.have.been.calledWith('Select services to start');
					expect(composeService.up).to.have.been.calledWith(services);
					expect(mocks.logger.logStart).to.have.been.calledWith('Start services');
					expect(mocks.logger.logError).to.have.been.calledWith(expectedError);
				});

		});

		it('should start the given service', () => {

			// given
			const
				expectedServiceName = 'testService',
				expectedOptions = { _: ['d', 's', expectedServiceName] },
				services = {
					[expectedServiceName]: 'test1.yml'
				};

			composeService.getAllServices.resolves(services);
			composeService.up.resolves();
			promptService.getServicesForProcess.resolves(services);
			dockerService.removeDanglingImages.resolves();

			// when/then
			return expect(docker.startServices(expectedOptions))
				.to.eventually.be.fulfilled
				.then(() => {
					expect(composeService.getAllServices).to.have.been.calledOnce;
					expect(dockerService.removeDanglingImages).to.have.been.calledOnce;
					expect(promptService.getServicesForProcess).to.have.been.calledOnce;
					expect(composeService.up).to.have.been.calledOnce;
					expect(mocks.logger.logStart).to.have.been.calledOnce;
					expect(mocks.logger.logFinish).to.have.been.calledOnce;
					expect(promptService.getServicesForProcess).to.have.been.calledWith('Select services to start');
					expect(composeService.up).to.have.been.calledWith(services);
					expect(mocks.logger.logStart).to.have.been.calledWith('Start services');
					expect(mocks.logger.logFinish).to.have.been.calledWith('Started services');
				});

		});

	});

	describe('stopServices', () => {

		it('should catch errors', () => {

			// given
			const
				expectedService = 'ffdc -container',
				expectedOptions = { _: ['d', 'st', expectedService] },
				expectedError = new Error('test');

			dockerService.listContainers.returns(expectedService);
			dockerService.removeDanglingImages.rejects(expectedError);

			// when/then
			return expect(docker.stopServices(expectedOptions))
				.to.eventually.be.fulfilled
				.then(() => {
					expect(dockerService.removeDanglingImages).to.have.been.calledOnce;
					expect(promptService.getServicesForProcess).to.have.been.calledOnce;
					expect(mocks.logger.logStart).to.have.been.calledOnce;
					expect(mocks.logger.logFinish).to.have.been.calledOnce;
					expect(dockerService.listContainers).to.not.have.been.called;
					expect(dockerService.stopContainers).to.not.have.been.called;
					expect(mocks.logger.logStart).to.have.been.calledWith('Stop services');
					expect(mocks.logger.logError).to.have.been.calledWith(expectedError);
				});

		});

		it('should log Docker stopContainers failures', () => {

			// given
			const
				expectedService = 'ffdc -container',
				expectedOptions = { _: ['d', 'st', expectedService] },
				expectedError = new Error('test'),
				services = {
					[expectedService]: expectedService
				};

			promptService.getServicesForProcess.resolves(services);
			dockerService.removeDanglingImages.resolves();
			dockerService.stopContainers.rejects(expectedError);

			// when/then
			return expect(docker.stopServices(expectedOptions))
				.to.eventually.be.fulfilled
				.then(() => {
					expect(dockerService.removeDanglingImages).to.have.been.calledOnce;
					expect(promptService.getServicesForProcess).to.have.been.calledOnce;
					expect(dockerService.stopContainers).to.have.been.calledOnce;
					expect(mocks.logger.logStart).to.have.been.calledOnce;
					expect(mocks.logger.logFinish).to.have.been.calledOnce;
					expect(promptService.getServicesForProcess).to.have.been.calledWith('Select services to stop');
					expect(mocks.logger.logStart).to.have.been.calledWith('Stop services');
					expect(mocks.logger.logError).to.have.been.calledWith(expectedError);
				});

		});

	});

});