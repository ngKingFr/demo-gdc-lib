import { GdcLibPage } from './app.po';

describe('gdc-lib App', () => {
  let page: GdcLibPage;

  beforeEach(() => {
    page = new GdcLibPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
