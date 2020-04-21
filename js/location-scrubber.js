// JS code specific to location-scrubber

if (logo) {
    $("#logo").attr("src", logo);
    $("#btn_logo").attr("src", logo);
    $("#map_logo").attr("src", logo);
} else {
    $("#logo").hide();
    $("#btn_logo").hide();
    $("#map_logo").hide();
}

if (logo_text) {
    $("#logo_name").attr("src", logo_text);
    $("#map_logo_name").attr("src", logo_text);
} else {
    $("#logo_name").hide();
    $("#map_logo_name").hide();
}

$(document).ready(function () {
    if (has_backend) {
        $("#password").keypress(function (e) {
            if (e.keyCode == 13) $("#login").click();
        });
    } else {
        $("#api-key").keypress(function (e) {
            if (e.keyCode == 13) $("#submit").click();
        });
    }
});

///////////////////////////////////////
// Login

if (
    !isInitalized(MAP_API_KEY) ||
    MAP_API_KEY == "" ||
    MAP_API_KEY == null ||
    MAP_API_KEY == "null" ||
    MAP_API_KEY == "MAP_API_KEY"
) {
    // First run, do the "startup" sequence
    startupSequence();
} else {
    // Returning, already finished with the startup
    $("#floating-panel").show();
    $("#map").show();
    $("#map_logo").show();
    $("#map_logo_name").show();
    if (has_backend) $("#logout").show();

    // Inject the Google Maps Javascript API key
    var script = document.createElement("script");
    script.async = true;
    script.defer = true;
    script.src =
        "https://maps.googleapis.com/maps/api/js?key=" +
        MAP_API_KEY +
        "&libraries=drawing,geometry&callback=initMap";
    document.head.appendChild(script);
}

var exposurePoints;
var exposurePaths;

// Associative array of groupId to markers, JSON elements, and
// LatLngBounds objects contained within each group
//
var exposureGroups;

var exposureJSON;

const MARKER_ZINDEX = {
    DEFAULT: 0, //ideally would have liked to use google.maps.Marker.MAX_ZINDEX, but it library isn't initalized when this tries to load
    SELECTED: 4, //selected marker is always on top
    GROUP: 3, //followed by others in its selected group
    TRANSIENT: 2, //transients are higher priority than recurring (???)
    RECURRING: 1, //
    TRAVEL: 0, //travel should always be on the bottom
};

const GROUP_TYPES = {
    UNDEF: "undefined",
    RECURRING: "recurring",
    TRANSIENT: "transient",
    TRAVEL: "travel",
};

const MARKER_ICONS = {
    DEFAULT: "https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|FE7569", //RED
    GROUP: "https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|855dfd", //PURPLE
    SELECTED: "https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|34ba46", //GREEN
    RECURRING: "https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|e661ac", //PINK
    TRANSIENT: "https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|ff9900", //ORANGE
    TRAVEL: "https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|fdf569", //YELLOW
};

var map;
//May still have use for geo-coding
//var infoWindow;
var drawingManager;
var selectedArea;
var selectedAreaControls;
var selectedMarker;
var global_uncolorClosure = null;
var selectedGroupID = null;
var msVizStart; // all times are in milliseconds;
var msVizEnd;
var fileRegExp = new RegExp(/\.(json|null)$/);

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 14,
        center: {
            lat: 42.3601,
            lng: -71.0942,
        },
        mapTypeId: "terrain",
    });

    //infoWindow = new google.maps.InfoWindow();

    google.maps.event.addListenerOnce(map, "bounds_changed", function (event) {
        this.setZoom(map.getZoom() - 1);

        if (this.getZoom() > 15) {
            this.setZoom(15);
        }
    });

    google.maps.event.addListener(map, "click", function (event) {
        selectNone();
    });

    initDrawing();

    initDateSlider(0, 0);
}

function selectNone() {
    if (global_uncolorClosure) {
        global_uncolorClosure();
    }
    deleteAreaBoundary();
}

function deleteAreaMarkers() {
    if (isInitalized(selectedArea)) {
        if (isInitalized(exposurePoints)) {
            let areaBounds = selectedArea.getBounds();
            exposurePoints.forEach(function (element, index) {
                if (isInitalized(element.getMap()) && areaBounds.contains(element.getPosition())) {
                    deleteExposure(index, element);
                }
            });
        }
        deleteAreaBoundary();
    }
}

function clearMap() {
    clearMarkers();
    clearPolylines();

    selectedGroupID = null;
    selectedMarker = null;
    global_uncolorClosure = null;
}

function clearMarkers() {
    if (isInitalized(exposurePoints)) {
        exposurePoints.forEach(function (element, index) {
            if (isInitalized(element)) {
                selectedMarker = element;
                deleteMarker(element);
            }
        });
        exposurePoints = null;
    }
}

function deleteAll() {
    if (isInitalized(selectedArea)) {
        deleteAreaMarkers();
    } else {
        eraseGroup(null, selectedGroupID);
        global_uncolorClosure();
    }
}

function deleteSelectedMarker() {
    if (selectedMarker) {
        editExposure(0, selectedMarker);
        selectedGroupID = null;
    }
}

function clearPolylines() {
    if (isInitalized(exposurePaths)) {
        exposurePaths.forEach(function (element, index) {
            if (isInitalized(element)) {
                deletePolyline(element);
            }
        });
        exposurePaths = null;
    }
}

function deletePolyline(polyline) {
    removeLine(polyline);
    polyline = null;
}

function normalizeInputData(arr) {
    // This fixes several issues that I found in different input data:
    //   * Values stored as strings instead of numbers
    //   * Extra info in the input
    //   * Improperly sorted data (can happen after an Import)
    var result = [];

    for (var i = 0; i < arr.length; i++) {
        elem = arr[i];
        if ("time" in elem && "latitude" in elem && "longitude" in elem) {
            result.push({
                time: Number(elem.time),
                latitude: Number(elem.latitude),
                longitude: Number(elem.longitude),
            });
        }
    }

    result.sort(function (a, b) {
        return a.time - b.time;
    });
    return result;
}

function loadPath() {
    file = $("#privatekitJSON").get(0).files[0];
    if (typeof window.FileReader !== "function") {
        alert("The file API isn't supported on this browser yet.");
    } else if (file === undefined || !fileRegExp.test(file.name)) {
        alert("Unable to load the file.");
    } else {
        clearMap();
        exposurePoints = [];
        exposurePaths = [];
        exposureGroups = [];
        exposureJSON = null;

        fr = new FileReader();
        fr.onload = (function (map, points, path) {
            return function (event) {
                let lines = event.target.result;
                let lastLatLng = null;
                let currentGroupId = 0;
                let currentGroupBounds = new google.maps.LatLngBounds();
                exposureJSON = normalizeInputData(JSON.parse(lines));

                exposureJSON.forEach(function (element, index) {
                    elementLatLng = new google.maps.LatLng(element.latitude, element.longitude);

                    let marker = new google.maps.Marker({
                        position: elementLatLng,
                        title: new Date(element.time).toLocaleString(), //convert to UC unix to a "human" time with local time conversion
                        icon: MARKER_ICONS.DEFAULT,
                        map: map,
                    });

                    points.push(marker);

                    //create a circle with which to measure a 100' radius from the center of our current bounds
                    if (
                        !currentGroupBounds.isEmpty() &&
                        google.maps.geometry.spherical.computeDistanceBetween(
                            elementLatLng,
                            currentGroupBounds.getCenter()
                        ) > 30.48
                    ) {
                        //save off the previous group for later evaluation as recurring or transient
                        exposureGroups[currentGroupId].bounds = currentGroupBounds;

                        //increment the groupId
                        ++currentGroupId;

                        //create a new group bound and add current location to that group
                        currentGroupBounds = new google.maps.LatLngBounds();
                    }
                    //just add this location to our group bounds in order to update the center of the group appropriately
                    currentGroupBounds.extend(elementLatLng);

                    //create a new object to hold the groups if we don't have one already
                    if (
                        exposureGroups[currentGroupId] === undefined ||
                        exposureGroups[currentGroupId] === null
                    ) {
                        exposureGroups[currentGroupId] = {
                            markers: [],
                            elements: [],
                            bounds: currentGroupBounds,
                        };
                    }
                    exposureGroups[currentGroupId].markers.push(marker);
                    exposureGroups[currentGroupId].elements.push(element);

                    //set our current JSON element properties with our current group info
                    element.groupId = currentGroupId;
                    element.groupType = GROUP_TYPES.UNDEF;

                    //we add the event listener after we determine what group the marker is in
                    google.maps.event.addListener(
                        marker,
                        "click",
                        (function (thisMarker, groupId) {
                            return function (event) {
                                selectNone();
                                enableDelete(false);

                                let groupType = exposureGroups[groupId].elements[0].groupType;

                                // when we click a marker set all the markers in that group to purple
                                exposureGroups[groupId].markers.forEach(function (element, index) {
                                    element.setIcon(MARKER_ICONS.GROUP);
                                    element.setZIndex(MARKER_ZINDEX.GROUP);
                                });
                                //then set the clicked marker to green
                                thisMarker.setIcon(MARKER_ICONS.SELECTED);
                                thisMarker.setZIndex(MARKER_ZINDEX.SELECTED);

                                let uncolorColsure = (function (groupId) {
                                    return function (event) {
                                        exposureGroups[groupId].markers.forEach(function (element, index) {
                                            element.setIcon(getMarkerIcon(groupType));
                                            element.setZIndex(getMarkerZIndex(groupType));
                                        });

                                        if (groupId == selectedGroupID) {
                                            selectedGroupID = null;
                                        }

                                        enableDelete(false, false);
                                    };
                                })(groupId);

                                selectedGroupID = groupId;
                                selectedMarker = thisMarker;
                                global_uncolorClosure = uncolorColsure;

                                enableDelete(exposureGroups[groupId].markers.length > 1, true);
                            };
                        })(marker, currentGroupId)
                    );

                    if (isInitalized(lastLatLng)) {
                        let polylinePath = new google.maps.Polyline({
                            path: [lastLatLng, elementLatLng],
                            strokeColor: "#FF0000",
                            strokeOpacity: 1.0,
                            strokeWeight: 2,
                        });
                        path.push(polylinePath);
                        addLine(polylinePath);
                    }

                    lastLatLng = elementLatLng;
                });

                // Zoom to see all of the loaded points
                zoomToExtent();

                let groupCount = 0;
                let exposureGroupKeys = Object.keys(exposureGroups);
                let travelGroupId = null;
                let travelGroupMarkers = [];
                let travelGroupDurationMilliseconds = 0;
                let travelGroupDistanceMeters = 0;
                let lastExposureGroup = null;

                //this method will add the time and distance covered from the last marker to the current marker
                //  if the current marker is an array, it will "chain" all the markers in the array together and add their total time and distance covered too
                let addTravelGroupTimeAndDistance = function (fromGroup, toGroup) {
                    let duration = 0;
                    let distance = 0;

                    //add the time from the end of the "from group" to the end of the "to group"
                    let fromGroupEndTime = 0;
                    let currentGroupStartTime = toGroup.elements[0].time;
                    let currentGroupEndTime = toGroup.elements[toGroup.elements.length - 1].time;

                    if (isInitalized(fromGroup)) {
                        fromGroupEndTime = fromGroup.elements[fromGroup.elements.length - 1].time;
                        duration += currentGroupStartTime - fromGroupEndTime;
                    }

                    duration += currentGroupEndTime - currentGroupStartTime;

                    //add the distance from the end of the "from group" to the start of the "to group"
                    if (isInitalized(fromGroup)) {
                        let fromGroupEndPosition = fromGroup.markers[
                            fromGroup.markers.length - 1
                        ].getPosition();
                        let toGroupStartPosition = toGroup.markers[0].getPosition();

                        distance += google.maps.geometry.spherical.computeDistanceBetween(
                            fromGroupEndPosition,
                            toGroupStartPosition
                        );
                    }

                    //add the distance traveled within the "to group"
                    toGroup.markers.forEach(function (element, index) {
                        if (index > 0) {
                            distance += google.maps.geometry.spherical.computeDistanceBetween(
                                toGroup.markers[index - 1].getPosition(),
                                element.getPosition()
                            );
                        }
                    });

                    travelGroupDurationMilliseconds += duration;
                    travelGroupDistanceMeters += distance;
                };

                let updateTravelGroupMarkers = function (
                    travelGroupMarkers,
                    travelGroupId,
                    travelGroupDurationMilliseconds,
                    travelGroupDistanceMeters
                ) {
                    let travelGroupDurationHours = travelGroupDurationMilliseconds / (1000 * 60 * 60); //convert to hours
                    let travelGroupDistanceKilometers = travelGroupDistanceMeters / 1000;
                    let travelGroupSpeedKMPH = 0;

                    if (travelGroupDurationHours > 0) {
                        travelGroupSpeedKMPH = travelGroupDistanceKilometers / travelGroupDurationHours;
                    }

                    //round to 2 decimal places...soooo ugly in javascript
                    travelGroupSpeedMPH =
                        Math.round((travelGroupSpeedKMPH / 1.609 + Number.EPSILON) * 100) / 100;
                    travelGroupSpeedKMPH = Math.round((travelGroupSpeedKMPH + Number.EPSILON) * 100) / 100;

                    travelGroupMarkers.forEach(function (element, index) {
                        element.setTitle(
                            element.getTitle() +
                                "\nTravel Group " +
                                travelGroupId +
                                "\n" +
                                travelGroupSpeedMPH +
                                " mph" +
                                " | " +
                                travelGroupSpeedKMPH +
                                " km/h"
                        );
                    });
                };

                for (const key of exposureGroupKeys) {
                    groupCount++;

                    let foundIntersection = false;
                    for (var i = groupCount; i < exposureGroups.length; i++) {
                        //We may need to put some time boundaries on this because travel groups could intersect if you travel a similar route periodically.
                        if (
                            exposureGroups[key].bounds.intersects(exposureGroups[exposureGroupKeys[i]].bounds)
                        ) {
                            foundInteresection = true;
                            exposureGroups[key].elements.forEach(function (element, index) {
                                element.groupType = GROUP_TYPES.RECURRING;
                            });
                            exposureGroups[exposureGroupKeys[i]].elements.forEach(function (element, index) {
                                element.groupType = GROUP_TYPES.RECURRING;
                            });
                        }
                    }

                    //we can only be a travel group if we were previously not found to be a recurring group, and we found no intersections with the groups in front of us
                    if (
                        !foundIntersection &&
                        exposureGroups[key].elements[0].groupType != GROUP_TYPES.RECURRING
                    ) {
                        let travelMaxGroupSize = 3;
                        if (exposureGroups[key].elements.length <= travelMaxGroupSize) {
                            //groupCount is currently pointing to the item in front of the current group identified by key
                            //  if we are the first group (no previous group to compare with) OR if the previous group (two back from current groupCount value) was a travel group.
                            //  If so, we set keep the current travelGroupId and use that value.
                            //  If not, we increment the travelGroupId and take that value instead.
                            //  but we only look back if we are not the first group
                            if (
                                groupCount == 1 ||
                                exposureGroups[exposureGroupKeys[groupCount - 2]].elements[0].groupType !=
                                    GROUP_TYPES.TRAVEL
                            ) {
                                if (groupCount == 1 || !isInitalized(travelGroupId)) {
                                    travelGroupId = 0;
                                } else {
                                    travelGroupId++;
                                }
                            }
                            exposureGroups[key].elements.forEach(function (element, index) {
                                element.groupType = GROUP_TYPES.TRAVEL;
                                element.travelGroupId = travelGroupId;
                            });

                            //update current travel group's duration and distance
                            addTravelGroupTimeAndDistance(lastExposureGroup, exposureGroups[key]);

                            //add all the travel group markers to the list to be updated
                            exposureGroups[key].markers.forEach(function (element, index) {
                                travelGroupMarkers.push(element);
                            });
                        } else {
                            exposureGroups[key].elements.forEach(function (element, index) {
                                element.groupType = GROUP_TYPES.TRANSIENT;
                            });
                        }
                    }

                    let groupType = exposureGroups[key].elements[0].groupType;

                    //every time we encounter a non-travel group OR we get to the lasst exposureGroup, close out any open travel groups
                    if (
                        travelGroupMarkers.length > 0 &&
                        (groupType != GROUP_TYPES.TRAVEL ||
                            key == exposureGroupKeys[exposureGroupKeys.length - 1])
                    ) {
                        if (groupType != GROUP_TYPES.TRAVEL) {
                            //before we close it, update current travel group's duration and distance from its last marker to this non-travel groups first marker
                            addTravelGroupTimeAndDistance(lastExposureGroup, {
                                elements: [exposureGroups[key].elements[0]],
                                markers: [exposureGroups[key].markers[0]],
                            });
                        }

                        updateTravelGroupMarkers(
                            travelGroupMarkers,
                            travelGroupId,
                            travelGroupDurationMilliseconds,
                            travelGroupDistanceMeters
                        );

                        //close out the travel group metrics that we just updated
                        travelGroupMarkers = [];
                        travelGroupDurationMilliseconds = 0;
                        travelGroupDistanceMeters = 0;
                    }

                    exposureGroups[key].markers.forEach(function (element, index) {
                        element.setIcon(getMarkerIcon(groupType));
                        element.setZIndex(getMarkerZIndex(groupType));
                    });

                    //record the last exposure group so that when we encounter a travel group we can calculate the distance between that group and the last marker of the last group
                    lastExposureGroup = exposureGroups[key];
                }
                travelGroupMarkers = null; //free memory

                initDateSlider(exposureJSON[0].time, exposureJSON[exposureJSON.length - 1].time);
                updateStats();
            };
        })(map, exposurePoints, exposurePaths);
        fr.readAsText(file);

        $("#save").removeClass("disabled").addClass("enabled").prop("disabled", false);
    }
}

function initDateSlider(msStartDate, msEndDate) {
    let utcSecondsToMidnight = function (utcSeconds) {
        date = new Date(utcSeconds);
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        return date.getTime();
    };

    msStartDate = utcSecondsToMidnight(msStartDate);
    msEndDate = utcSecondsToMidnight(msEndDate);

    let incrementFactor = 1000 * 60 * 60; //milliseconds in one hour
    let sliderStepCount = Math.ceil((msEndDate - msStartDate) / incrementFactor) + 24; //number of days to have the slider cover (has to be +1 because we take the end date and move back to midnight)
    $(function () {
        let windowRange = {
            value: null,
        }; //needs to be an object to work nicely with closures.  Alternatively, can move to a global variable, but that is a PITA
        $("#slider-range").slider({
            range: true,
            min: 0,
            max: sliderStepCount,
            values: [0, sliderStepCount],
            start: (function (windowRange) {
                return function (event, ui) {
                    let eventSuccess = true;
                    if ($("#lock-window").prop("checked")) {
                        if (!isInitalized(windowRange.value)) {
                            windowRange.value = ui.values[1] - ui.values[0];
                            if (windowRange.value <= 0) {
                                eventSuccess = false;
                                windowRange.value = null;
                                $("#lock-window").prop("checked", false);
                                alert("Cannot move lock sliders when locked to the same day!");
                            }
                        }
                    } else {
                        windowRange.value = null;
                    }
                    return eventSuccess;
                };
            })(windowRange),
            slide: (function (msStartDate, incrementFactor, windowRange) {
                return function (event, ui) {
                    let eventSuccess = true;
                    if ($("#lock-window").prop("checked") && isInitalized(windowRange.value)) {
                        let slidingHandle = ui.handleIndex;
                        let followingHandle = Math.abs(slidingHandle - 1);
                        if (ui.values[1] - ui.values[0] != windowRange.value) {
                            let valueDelta = 0;
                            if (followingHandle == 1) {
                                valueDelta = windowRange.value - (ui.values[1] - ui.values[0]);
                            } else if (followingHandle == 0) {
                                valueDelta = ui.values[1] - ui.values[0] - windowRange.value;
                            }

                            let followingHandleTargetValue = ui.values[followingHandle] + valueDelta;
                            if (
                                followingHandleTargetValue >= $("#slider-range").slider("option", "min") &&
                                followingHandleTargetValue <= $("#slider-range").slider("option", "max")
                            ) {
                                $("#slider-range").slider(
                                    "values",
                                    followingHandle,
                                    ui.values[followingHandle] + valueDelta
                                );
                                ui.values[followingHandle] += valueDelta;
                            } else {
                                eventSuccess = false;
                            }
                        }
                    }
                    if (eventSuccess) {
                        msVizStart = msStartDate + ui.values[0] * incrementFactor;
                        msVizEnd = msStartDate + ui.values[1] * incrementFactor;

                        var startDate = new Date(msVizStart);
                        var endDate = new Date(msVizEnd);

                        updateDateRange(startDate, endDate);
                    }
                    return eventSuccess;
                };
            })(msStartDate, incrementFactor, windowRange),
        });

        // Set the display string
        msVizStart = msStartDate + $("#slider-range").slider("values", 0) * incrementFactor;
        msVizEnd = msStartDate + $("#slider-range").slider("values", 1) * incrementFactor;
        let startDate = new Date(msVizStart);
        let endDate = new Date(msVizEnd);
        updateDateRange(startDate, endDate);
    });
}

function updateExposurePoints() {
    let incrementFactor = 1000 * 60; //milliseconds in one minute

    let hideGroupMarkers = function (toogleEnabled, group) {
        if (toogleEnabled) {
            group.markers.forEach(function (element, index) {
                removeMarker(element);
                removeLinesToPoint(exposurePoints.indexOf(element));
            });
        } else {
            group.markers.forEach(function (element, index) {
                //we need to make sure that we only show thing that have not been redacted...the marker indicies and the element indicies should be aligned
                if (
                    isInitalized(group.elements[index].latitude) &&
                    isInitalized(group.elements[index].longitude)
                ) {
                    //addMarker(element);
                    //replaceLinesToPoint(exposurePoints.indexOf(element));
                    applyTimeWindow(group.elements[index]);
                }
            });
        }
    };

    let applyTimeWindow = function (exposureJSONElement) {
        let elementIndex = exposureJSON.indexOf(exposureJSONElement);
        //hide all markers if the exposure timestamp is outside the window
        if (exposureJSONElement.time < msVizStart || exposureJSONElement.time > msVizEnd) {
            removeMarker(exposurePoints[elementIndex]);
            removeLinesToPoint(elementIndex);
        } else {
            //show all markers, if they have not been redacted via deletion
            if (isInitalized(exposureJSONElement.latitude) && isInitalized(exposureJSONElement.longitude)) {
                addMarker(exposurePoints[elementIndex]);
                replaceLinesToPoint(elementIndex);
            }
        }
    };

    if (isInitalized(exposureGroups)) {
        let exposureGroupKeys = Object.keys(exposureGroups);
        for (const key of exposureGroupKeys) {
            let group = exposureGroups[key];
            let groupType = group.elements[0].groupType;

            if (groupType == GROUP_TYPES.TRAVEL) {
                hideGroupMarkers($("#hide-travel").prop("checked"), group);
            } else {
                let groupTimeBoundsStartTime = group.elements[0].time;
                let groupTimeBoundsEndTime = group.elements[group.elements.length - 1].time;
                let groupTimeBounds = (groupTimeBoundsEndTime - groupTimeBoundsStartTime) / incrementFactor;

                if (groupTimeBounds < 60) {
                    if (groupTimeBounds < 30) {
                        if (groupTimeBounds < 15) {
                            hideGroupMarkers(
                                $("#hide-15").prop("checked") ||
                                    $("#hide-30").prop("checked") ||
                                    $("#hide-60").prop("checked"),
                                group
                            );
                        } else {
                            hideGroupMarkers(
                                $("#hide-30").prop("checked") || $("#hide-60").prop("checked"),
                                group
                            );
                        }
                    } else {
                        hideGroupMarkers($("#hide-60").prop("checked"), group);
                    }
                } else {
                    group.elements.forEach(function (element, index) {
                        applyTimeWindow(element);
                    });
                }
            }
        }
        updateStats();
    }
}

function getMarkerIcon(groupType) {
    let markerIcon = MARKER_ICONS.DEFAULT;

    if (groupType == GROUP_TYPES.RECURRING) {
        markerIcon = MARKER_ICONS.RECURRING;
    } else if (groupType == GROUP_TYPES.TRANSIENT) {
        markerIcon = MARKER_ICONS.TRANSIENT;
    } else if (groupType == GROUP_TYPES.TRAVEL) {
        markerIcon = MARKER_ICONS.TRAVEL;
    }

    return markerIcon;
}

function getMarkerZIndex(groupType) {
    let markerZIndex = MARKER_ZINDEX.DEFAULT;

    if (groupType == GROUP_TYPES.RECURRING) {
        markerZIndex = MARKER_ZINDEX.RECURRING;
    } else if (groupType == GROUP_TYPES.TRANSIENT) {
        markerZIndex = MARKER_ZINDEX.TRANSIENT;
    } else if (groupType == GROUP_TYPES.TRAVEL) {
        markerZIndex = MARKER_ZINDEX.TRAVEL;
    }

    return markerZIndex;
}

function zoomToExtent(mapBounds) {
    // Zoom to the extent of the selection or the extent of all points

    if (mapBounds === undefined || mapBounds === null) {
        if (isInitalized(selectedGroupID)) return zoomToGroup(selectedGroupID);
        else if (selectedArea) return zoomToArea();
        else if (isInitalized(exposurePoints)) {
            mapBounds = new google.maps.LatLngBounds();
            exposurePoints.forEach(function (element, index) {
                if (element.getMap() !== null) {
                    mapBounds.extend(element.getPosition());
                }
            });
        } else {
            map.setCenter(new google.maps.LatLng(39.0609926, -94.5734936, 19.75));
            return;
        }
    }
    map.setCenter(mapBounds.getCenter());
    map.fitBounds(mapBounds);
}

function zoomToArea() {
    // TODO: Should we zoom to the extent of the points within the
    //       area instead of the area itself?
    let areaBounds = selectedArea.getBounds();
    map.setCenter(areaBounds.getCenter());
    map.fitBounds(areaBounds);
}

function zoomToGroup(groupId) {
    // Zoom to the extents of the group
    mapBounds = new google.maps.LatLngBounds();

    exposureGroups[groupId].markers.forEach(function (element, index) {
        if (element.getMap() !== null) {
            mapBounds.extend(element.getPosition());
        }
    });

    map.setCenter(mapBounds.getCenter());
    map.fitBounds(mapBounds);
}

function addMarker(marker) {
    marker.setMap(map);
}

function addLine(polyline) {
    polyline.setMap(map);
}

function removeMarker(marker) {
    if (isInitalized(marker)) {
        marker.setMap(null);
    }
}

function removeLine(polyline) {
    if (isInitalized(polyline)) {
        polyline.setMap(null);
    }
}

function erasePoint(event) {
    if (isInitalized(selectedMarker)) {
        editExposure(event, selectedMarker);
    }
}

function eraseGroup(event, groupId) {
    exposureGroups[groupId].markers.forEach(function (element, index) {
        editExposure(event, element);
    });
}

function editExposure(event, marker) {
    let i = 0;
    let bFoundPath = false;

    //DANGER: loop condition uses shortcutting and in-place incrementing in order to work!
    do {
        if (exposurePoints[i] === marker) {
            bFoundPath = true;
            deleteExposure(i, marker);
        }
    } while (!bFoundPath && ++i < exposurePoints.length);

    enableDelete(false, false);
}

function deleteExposure(i, marker) {
    //remove the marker from the map
    removeMarker(marker);

    //remove the connecting lines
    removeLinesToPoint(i);

    //handle the actual exposure data
    exposureJSON[i].latitude = null;
    exposureJSON[i].longitude = null;
    updateStats();
}

function removeLinesToPoint(i) {
    if (exposurePaths.length > 0) {
        //remove the line leading FROM the marked point, if it exists
        if (i < exposurePoints.length - 1) {
            removeLine(exposurePaths[i]);
        }

        //remove the line leading TO the marked point, if it exists
        if (i > 0) {
            removeLine(exposurePaths[i - 1]);
        }
    }
}

function replaceLinesToPoint(i) {
    if (exposurePaths.length > 0) {
        //add the line leading FROM the marked point, if it exists, and if the point in front of me is visible
        if (i < exposurePoints.length - 1 && isInitalized(exposurePoints[i + 1].getMap())) {
            addLine(exposurePaths[i]);
        }

        //add the line leading TO the marked point, if it exists, and if the point behind me is visible
        //  NOTE: as long as we are looping forward over time for points, this will catch the first line
        //    as the 1st point will be visible, not enabling it's line, then the 2nd point will become visible and enable the line to the 1st point
        if (i > 0 && isInitalized(exposurePoints[i - 1].getMap())) {
            addLine(exposurePaths[i - 1]);
        }
    }
}

function updateStats() {
    let statsElement = $("#stats");
    let loadedElement = $("#loaded", statsElement);
    let visibleCount = 0;
    let hiddenCount = 0;
    let deletedCount = 0;
    let totalCount = 0;
    let visibleElement = $("#visible", statsElement);
    let hiddenElement = $("#hidden", statsElement);
    let deletedElement = $("#deleted", statsElement);
    let totalElement = $("#total", statsElement);
    if (loadedElement.length == 0) {
        loadedElement = $("<div />")
            .prop("id", "loaded")
            .html("Loaded: " + exposureJSON.length + "");
        statsElement.prepend(loadedElement);
    }
    exposureJSON.forEach(function (element, index) {
        if (!isInitalized(element.latitude) || !isInitalized(element.longitude)) {
            deletedCount++;
        } else if (isInitalized(exposurePoints[index].getMap())) {
            visibleCount++;
        } else {
            hiddenCount++;
        }
    });

    totalCount = visibleCount + deletedCount + hiddenCount;
    visibleElement.html(+visibleCount);
    hiddenElement.html(+hiddenCount);
    deletedElement.html(+deletedCount);
    totalElement.html(+totalCount);
}

function saveText() {
    // Create the export format.  It should be exactly the same as
    // the import format, just missing the redacted points.
    let out = [];
    for (var i = 0; i < exposureJSON.length; i++) {
        if (
            isInitalized(exposureJSON[i].latitude) &&
            isInitalized(exposureJSON[i].longitude) &&
            isInitalized(exposurePoints[i].getMap())
        ) {
            element = {};
            element.time = exposureJSON[i].time;
            element.longitude = exposureJSON[i].longitude;
            element.latitude = exposureJSON[i].latitude;
            out.push(element);
        }
    }

    // Get loaded filename...
    let file = $("#privatekitJSON").get(0).files[0];
    let filename = file.name.replace(fileRegExp, "-REDACTED.json");

    if (has_backend) {
        // POST redacted data to the backend

        $("#saving-panel").show();

        let payload = {
            identifier: filename,
            trail: out,
        };

        var req = $.ajax({
            url: "/redacted_trail/",
            type: "POST",
            data: JSON.stringify(payload),
            // Fetch the stored token from localStorage and set in the header
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        });

        req.done(function (msg) {
            $("#progress").text("Result:" + msg);
            setTimeout(function () {
                $("#saving-panel").hide();
            }, 1000);
        });

        req.fail(function (jqXHR, textStatus) {
            $("#progress").text("Error: " + textStatus);
        });
    } else {
        // Just save as a simple JSON file

        let output = JSON.stringify(out);
        var a = document.createElement("a");
        a.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(output));
        a.setAttribute("download", filename);
        a.click();

        // TODO: Use HTML5 saveAs()
        //var blob = new Blob([text], { type: "text/plain;charset=utf-8" });
        //saveAs(blob, filename);
    }
}
