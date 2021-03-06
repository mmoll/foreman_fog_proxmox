# frozen_string_literal: true

# Copyright 2018 Tristan Robert

# This file is part of ForemanFogProxmox.

# ForemanFogProxmox is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.

# ForemanFogProxmox is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.

# You should have received a copy of the GNU General Public License
# along with ForemanFogProxmox. If not, see <http://www.gnu.org/licenses/>.

module FogExtensions
    module Proxmox
        module Container
            extend ActiveSupport::Concern
            attr_accessor :ostemplate_storage, :ostemplate_file, :password
            def to_s
                name
            end
            def persisted?
                !!identity && !!uptime
            end
            def identity
                "#{type}_#{vmid}"
            end
            def volumes
                config.mount_points
            end
            def mount_points
                config.mount_points.collect { |mp| mp.id+': '+mp.volid }
            end
            def memory
                maxmem.to_i
            end
            def interfaces
                config.interfaces
            end
            def vm_description
                "Name=#{name}, vmid=#{vmid}"
            end
            def interfaces_attributes=(attrs); end
            def volumes_attributes=(attrs); end
            def config_attributes=(attrs); end
            def templated?
                volumes.any? { |volume| volume.templated? }
            end
        end
    end
end   