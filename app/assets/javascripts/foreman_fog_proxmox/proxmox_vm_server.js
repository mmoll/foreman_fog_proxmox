// Copyright 2018 Tristan Robert

// This file is part of ForemanFogProxmox.

// ForemanFogProxmox is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// ForemanFogProxmox is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with ForemanFogProxmox. If not, see <http://www.gnu.org/licenses/>.

function cdromSelected(item) {
  var selected = $(item).val();
  var cdrom_image_form = $('#cdrom_image_form');

  switch (selected) {
    case 'none':
      initCdromStorage();
      initCdromOptions('iso');
      cdrom_image_form.hide();
      break;
    case 'cdrom':
      initCdromStorage();
      initCdromOptions('iso');
      cdrom_image_form.hide();
      break;
    case 'image':
      initCdromStorage();
      initCdromOptions('iso');
      cdrom_image_form.show();
      break;
    default:
      break;
  }
  return false;
}

function initCdromStorage() {
  var select = '#host_compute_attributes_config_attributes_cdrom_storage';
  $(select + ' option:selected').prop('selected', false);
  $(select).val('');
}

function initCdromOptions(name) {
  var select = '#host_compute_attributes_config_attributes_cdrom_' + name;
  $(select).empty();
  $(select).append($("<option></option>").val('').text(''));
  $(select).val('');
}

function storageIsoSelected(item) {
  var storage = $(item).val();
  if (storage != '') {
    tfm.tools.showSpinner();
    $.getJSON({
      type: 'get',
      url: '/foreman_fog_proxmox/isos/' + storage,
      complete: function () {
        tfm.tools.hideSpinner();
      },
      error: function (j, status, error) {
        console.log("Error=" + error + ", status=" + status + " loading isos for storage=" + storage);
      },
      success: function (isos) {
        initCdromOptions('iso');
        $.each(isos, function (i, iso) {
          $('#host_compute_attributes_config_attributes_cdrom_iso').append($("<option></option>").val(iso.volid).text(iso.volid));
        });
      }
    });
  } else {
    initCdromOptions('iso');
  }
}

function controllerSelected(item) {
  var controller = $(item).val();
  var index = getIndex(item);
  var max = computeControllerMaxDevice(controller);
  var device_selector = '#host_compute_attributes_volumes_attributes_' + index + '_device';
  $(device_selector).attr('data-soft-max', max);
  var device = $(device_selector).limitedSpinner('value');
  $('#host_compute_attributes_volumes_attributes_' + index + '_id').val(controller + device);
  tfm.numFields.initAll();
}

function deviceSelected(item) {
  var device = $(item).limitedSpinner('value');
  console.log("device=" + device);
  var index = getIndex(item);
  var controller_selector = '#host_compute_attributes_volumes_attributes_' + index + '_controller';
  var controller = $(controller_selector).val();
  $('#host_compute_attributes_volumes_attributes_' + index + '_id').val(controller + device);
  tfm.numFields.initAll();
}

function getIndex(item) {
  var id = $(item).attr('id');
  var pattern = /(host_compute_attributes_volumes_attributes_)(\d+)[_](.*)/i;
  pattern_a = pattern.exec(id);
  var index = pattern_a[2];
  console.log("index=" + index);
  return index;
}

function computeControllerMaxDevice(controller) {
  switch (controller) {
    case 'ide':
      return 3;
    case 'sata':
      return 5;
    case 'scsi':
      return 13;
    case 'virtio':
      return 15;
    default:
      return 1;
  }
}

function balloonSelected(item) {
  var ballooned = $(item).is(':checked');
  var memory_f = $("input[name$='[config_attributes][memory]']:hidden");
  var min_memory_f = $("input[id$='config_attributes_min_memory']");
  var min_memory_hidden_f = $("input[name$='[config_attributes][min_memory]']:hidden");
  var shares_f = $("input[id$='config_attributes_shares']");
  var shares_hidden_f = $("input[name$='[config_attributes][shares]']:hidden");
  if (ballooned) {
    min_memory_f.removeAttr('disabled');
    shares_f.removeAttr('disabled');
    var max = memory_f.val();
    console.log("max=" + max);
    min_memory_f.attr('data-soft-max', max);
  } else {
    min_memory_f.attr('disabled', 'disabled');
    min_memory_hidden_f.attr('value', '');
    shares_f.attr('disabled', 'disabled');
    shares_hidden_f.attr('value', '');
  }
  tfm.numFields.initAll();
}