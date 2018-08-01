/* global describe, beforeEach, it, expect */
/* global Paysage, PreviewManagement */

describe('The Preview Management', function () {
  beforeEach(function () {
    Paysage.previewManagement = new PreviewManagement();
  });

  it('should remove the solo flag on deleted codeobject', function () {
    var hasShownCodeObjects = 0;
    Paysage.previewManagement.showCodeObjects = function () {
      hasShownCodeObjects++;
    };
    Paysage.previewManagement.solo('anatol', true);
    expect(Paysage.previewManagement.isSolo('anatol')).toBe(true);
    Paysage.previewManagement.delete('anatol');
    expect(Paysage.previewManagement.isSolo('anatol')).toBe(false);
    expect(hasShownCodeObjects).toBe(2);
  });
});
