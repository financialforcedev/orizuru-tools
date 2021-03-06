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

	questions = require('../../lib/util/questions'),

	expect = chai.expect;

describe('util/questions.js', () => {

	describe('checkboxField', () => {

		it('should return the config for an input field', () => {

			// When/then
			expect(questions.checkboxField('a', 'b', 'c', 'd')).to.eql({
				type: 'checkbox',
				message: 'a',
				name: 'b',
				validate: 'c',
				choices: 'd'
			});

		});

	});

	describe('confirmField', () => {

		it('should return the config for an input field', () => {

			// When/then
			expect(questions.confirmField('a', 'b', 'c', 'd')).to.eql({
				type: 'confirm',
				message: 'a',
				name: 'b',
				validate: 'c',
				['default']: 'd'
			});

		});

	});

	describe('inputField', () => {

		it('should return the config for an input field', () => {

			// When/then
			expect(questions.inputField('a', 'b', 'c', 'd')).to.eql({
				type: 'input',
				message: 'a',
				name: 'b',
				validate: 'c',
				['default']: 'd'
			});

		});

	});

	describe('listField', () => {

		it('should return the config for an input field', () => {

			// When/then
			expect(questions.listField('a', 'b', 'c', 'd', 'e')).to.eql({
				type: 'list',
				message: 'a',
				name: 'b',
				validate: 'c',
				choices: 'd',
				['default']: 'e'
			});

		});

	});

	describe('passwordField', () => {

		it('should return the config for an password field', () => {

			// When/then
			expect(questions.passwordField('a', 'b', 'c', 'd')).to.eql({
				type: 'password',
				message: 'a',
				name: 'b',
				validate: 'c',
				['default']: 'd'
			});

		});

	});

});
