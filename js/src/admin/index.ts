import app from 'flarum/admin/app';

export * from './components';
export * from '../common/components';
export * from '../common/models';
export * from '../common/util';

export { default as extend } from './extend';

app.initializers.add('fof/reactions', () => {
  //
});
