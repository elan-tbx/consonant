/* eslint-disable no-unused-expressions */
/* global describe it */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from '../../../blocks/aside/aside.js';
import { cleanVariations } from '../../../scripts/scripts.js';

const mock = await readFile({ path: './aside.mock.html' });
document.body.innerHTML = mock;
cleanVariations(document.body);

describe('aside', () => {
    const asides = document.querySelectorAll('.aside');
    asides.forEach((aside) => init(aside));

    describe('default aside', () => {
        it('has a detail', () => {
            const detail = asides[0].querySelector('.detail-M');
            expect(detail).to.exist;
        });

        it('has a heading', () => {
            const heading = asides[0].querySelector('.heading-XL');
            expect(heading).to.exist;
        });

        it('has a body', () => {
            const body = asides[0].querySelector('.body-S');
            expect(body).to.exist;
        });

        it('has content on the correct side', () => {
            const sides = asides[0].querySelectorAll('.foreground > div');
            expect(sides[0].className).to.equal('text');
            expect(sides[1].className).to.equal('image');
        });
    });
});
