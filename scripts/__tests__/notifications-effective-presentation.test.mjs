import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  effectivePresentation,
  sortPosts,
  bucketBySurface,
} from '../../assets/js/notifications/effective-presentation.js';

const productMap = { influxdb3_core: ['/influxdb3/core/'] };

function post(over) {
  return { presentation: 'drawer', severity: 'info', contexts: {}, ...over };
}

test('no docs context returns native presentation', () => {
  assert.equal(
    effectivePresentation(post({ presentation: 'banner' }), '/x/', productMap),
    'banner'
  );
});

test('display_override changes presentation on matching path', () => {
  const p = post({
    presentation: 'drawer',
    contexts: { docs: { display_override: { banner: ['influxdb3_core'] } } },
  });
  assert.equal(
    effectivePresentation(p, '/influxdb3/core/a/', productMap),
    'banner'
  );
  assert.equal(effectivePresentation(p, '/telegraf/', productMap), 'drawer');
});

test('override precedence is blocking > banner > drawer', () => {
  const p = post({
    presentation: 'drawer',
    contexts: {
      docs: {
        display_override: {
          drawer: ['/x/'],
          banner: ['/x/'],
          blocking: ['/x/'],
        },
      },
    },
  });
  assert.equal(effectivePresentation(p, '/x/', productMap), 'blocking');
});

test('sortPosts orders critical>warning>info then newest id first', () => {
  const items = [
    { id: '00000000-a', post: post({ severity: 'info' }) },
    { id: '00000000-b', post: post({ severity: 'critical' }) },
    { id: '00000000-c', post: post({ severity: 'info' }) },
  ];
  const sorted = sortPosts(items).map((i) => i.id);
  assert.deepEqual(sorted, ['00000000-b', '00000000-c', '00000000-a']);
});

test('bucketBySurface skips read and dismissed, buckets by effective presentation', () => {
  const items = [
    {
      id: '1',
      read: false,
      dismissed: false,
      post: post({ presentation: 'banner' }),
    },
    {
      id: '2',
      read: true,
      dismissed: false,
      post: post({ presentation: 'banner' }),
    },
    {
      id: '3',
      read: false,
      dismissed: true,
      post: post({ presentation: 'blocking' }),
    },
    {
      id: '4',
      read: false,
      dismissed: false,
      post: post({ presentation: 'blocking' }),
    },
  ];
  const { banner, blocking } = bucketBySurface(items, '/x/', productMap);
  assert.deepEqual(
    banner.map((i) => i.id),
    ['1']
  );
  assert.deepEqual(
    blocking.map((i) => i.id),
    ['4']
  );
});
