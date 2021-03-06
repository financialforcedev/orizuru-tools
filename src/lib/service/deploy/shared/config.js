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
	_ = require('lodash'),
	fs = require('fs-extra'),
	path = require('path'),

	createFile = (config) => {

		const
			orizuruFolder = path.resolve(process.cwd(), '.orizuru'),
			orizuruFile = path.resolve(process.cwd(), '.orizuru', 'config.json');

		return fs.mkdirp(orizuruFolder)
			.then(() => fs.writeJson(orizuruFile, {}))
			.then(() => {
				config = config || {};
				config.file = orizuruFile;
				return config;
			});

	},

	readSettings = (config) => {

		const filePath = path.resolve(process.cwd(), '.orizuru', 'config.json');
		return fs.readJson(filePath)
			.then(result => {
				config = config || {};
				config.file = filePath;
				config.orizuru = result;
				return config;
			})
			.catch(() => createFile(config)
				.then(() => {
					config = config || {};
					config.file = filePath;
					config.orizuru = {};
					return config;
				}));
	},

	writeSetting = (config, key, value) => {

		const setting = _.setWith({}, key, value);
		return readSettings(config)
			.then(config => {
				const newData = _.merge({}, config.orizuru, setting);
				return fs.writeJson(config.file, newData, { spaces: '\t' })
					.then(() => {
						config.orizuru = newData;
						return config;
					});
			})
			.then(config => config);

	};

module.exports = {
	createFile,
	readSettings,
	writeSetting
};
