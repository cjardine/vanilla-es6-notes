"use strict";

class NotesMap extends Gizmo {
    constructor(parentEl) {
        let template = '' +
            '<div>' +
            '<div class="columns">' +
            '<div class="column column-flex"><input type="text" class="map-input"></div>' +
            '<div class="column">' +
            '<button class="map-input-submit">submit</button>' +
            '<button class="map-input-submit">change</button>' +
            '</div>' +
            '</div>' +
            '<div class="map-container"></div>' +
            '</div>';
        super(template, parentEl);

        this._mapContainer = this.el.querySelector('.map-container');

        this.init();

        this.mapInput = this.el.querySelector('.map-input');
        this.mapInputSubmit = this.el.querySelector('.map-input-submit');

        if (App.app().mapReady) {
            this.initMap();
        } else {
            document.addEventListener('mapReady', (event) => {
                if (event.detail.value) {
                    this.initMap();
                }
            })
        }

        this.parent.addEventListener('refreshMap', (e) => {
            google.maps.event.trigger(this.map, 'resize');
            this.map.setCenter(this.marker.getPosition());
        })

    }

    initMap() {
        this.map = new google.maps.Map(this._mapContainer, {
            center: this.model.coords,
            zoom: 8
        });

        this.marker = new google.maps.Marker({
            label: 'test',
            position: this.model.coords,
            map: this.map
        });
        this.autoComplete = new google.maps.places.Autocomplete(this.mapInput);
        this.autoComplete.bindTo('bounds', this.map);

        this.autoComplete.addListener('place_changed', (event) => {
            // infowindow.close();
            this.marker.setVisible(false);
            let place = this.autoComplete.getPlace();
            if (!place.geometry) {
                window.alert("Autocomplete's returned place contains no geometry");
                return;
            }

            // If the place has a geometry, then present it on a map.
            if (place.geometry.viewport) {
                this.map.fitBounds(place.geometry.viewport);
            } else {
                this.map.setCenter(place.geometry.location);
                this.map.setZoom(17);  // Why 17? Because it looks good.
            }
            this.marker.setIcon(/** @type {google.maps.Icon} */({
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(35, 35)
            }));
            this.marker.setPosition(place.geometry.location);
            this.marker.setVisible(true);

            this.model.updateModel({
                isSet: true,
                coords: {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()},
                address: place.formatted_address
            });

            // let address = '';
            // if (place.address_components) {
            //     address = [
            //         (place.address_components[0] && place.address_components[0].short_name || ''),
            //         (place.address_components[1] && place.address_components[1].short_name || ''),
            //         (place.address_components[2] && place.address_components[2].short_name || '')
            //     ].join(' ');
            // }
            //
            // infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
            // infowindow.open(map, marker);
        });
    }

    setMarker() {

    }

}

App.gizmoList.push({name: 'NotesMap', className: NotesMap, query: 'map'});
