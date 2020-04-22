import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";
import { IntlProvider, addLocaleData } from "react-intl";
import en from "react-intl/locale-data/en";

import styles from "../assets/stylesheets/preferences-screen.scss";
import { lang, messages } from "../utils/i18n";
import { PreferenceListItem, PREFERENCE_LIST_ITEM_TYPE } from "./preference-list-item";

addLocaleData([...en]);

const isMobile = AFRAME.utils.device.isMobile() || AFRAME.utils.device.isMobileVR();

export default class PreferencesScreen extends Component {
  static propTypes = {
    onClose: PropTypes.func,
    store: PropTypes.object
  };

  UNSAFE_componentWillMount() {
    window.APP.preferenceScreenIsVisible = true;
  }
  componentWillUnmount() {
    window.APP.preferenceScreenIsVisible = false;
  }

  render() {
    const preferenceListItem = props => {
      return (
        <PreferenceListItem
          key={props.key}
          store={this.props.store}
          storeKey={props.key}
          prefType={props.prefType}
          min={props.min}
          max={props.max}
          currentValue={props.currentValue}
          onChange={props.onChange}
          options={props.options}
          defaultNumber={props.defaultNumber}
          defaultString={props.defaultString}
          defaultBool={props.defaultBool}
        />
      );
    };
    // TODO: Add search text field and sort rows by fuzzy search
    let useThisCamera =
      {
        key: "useThisCamera",
        prefType: PREFERENCE_LIST_ITEM_TYPE.SELECT,
        options: [{ value: "user", text: "User-Facing" }, { value: "environment", text: "Environment" }, { value: "default", text: "Default" }],
        defaultString: "default"
      };

    const originalGeneral = [
      useThisCamera,
      { key: "muteMicOnEntry", prefType: PREFERENCE_LIST_ITEM_TYPE.CHECK_BOX, defaultBool: false },
      { key: "onlyShowNametagsInFreeze", prefType: PREFERENCE_LIST_ITEM_TYPE.CHECK_BOX, defaultBool: false },
      { key: "allowMultipleHubsInstances", prefType: PREFERENCE_LIST_ITEM_TYPE.CHECK_BOX, defaultBool: false },
      { key: "maxResolution", prefType: PREFERENCE_LIST_ITEM_TYPE.MAX_RESOLUTION },
      {
        key: "materialQualitySetting",
        prefType: PREFERENCE_LIST_ITEM_TYPE.SELECT,
        options: [{ value: "low", text: "Low" }, { value: "high", text: "High" }],
        defaultString: isMobile ? "low" : "high"
      },
      {
        key: "globalVoiceVolume",
        prefType: PREFERENCE_LIST_ITEM_TYPE.NUMBER_WITH_RANGE,
        min: 0,
        max: 200,
        defaultNumber: 100
      },
      {
        key: "globalMediaVolume",
        prefType: PREFERENCE_LIST_ITEM_TYPE.NUMBER_WITH_RANGE,
        min: 0,
        max: 200,
        defaultNumber: 100
      },
      {
        key: "snapRotationDegrees",
        prefType: PREFERENCE_LIST_ITEM_TYPE.NUMBER_WITH_RANGE,
        min: 0,
        max: 90,
        defaultNumber: 45
      },
      { key: "disableMovement", prefType: PREFERENCE_LIST_ITEM_TYPE.CHECK_BOX, defaultBool: false },
      { key: "disableBackwardsMovement", prefType: PREFERENCE_LIST_ITEM_TYPE.CHECK_BOX, defaultBool: false },
      { key: "disableStrafing", prefType: PREFERENCE_LIST_ITEM_TYPE.CHECK_BOX, defaultBool: false },
      { key: "disableTeleporter", prefType: PREFERENCE_LIST_ITEM_TYPE.CHECK_BOX, defaultBool: false }
    ];

    // add camera choices to useThisCamera's options
    navigator.mediaDevices.enumerateDevices()
    .then(function(devices) {
      devices.forEach(function(device) {
        console.log(device.kind + ": " + device.label +
                    " id = " + device.deviceId);
        if (device.kind == "videoinput") {
          useThisCamera.options.push({value: device.deviceId, text: device.label});
        }
      });
    })
    .catch(function(err) {
      console.log(err.name + ": " + err.message);
    });

    const general = originalGeneral.map(preferenceListItem);

    const touchscreen = [
      { key: "enableOnScreenJoystickLeft", prefType: PREFERENCE_LIST_ITEM_TYPE.CHECK_BOX, defaultBool: false },
      { key: "enableOnScreenJoystickRight", prefType: PREFERENCE_LIST_ITEM_TYPE.CHECK_BOX, defaultBool: false }
    ].map(preferenceListItem);

    return (
      <IntlProvider locale={lang} messages={messages}>
        <div className={classNames(styles.preferencesPanel)}>
          <div className={classNames(styles.panelMargin)}>
            <button autoFocus className={classNames(styles.closeButton)} onClick={e => this.props.onClose(e)}>
              <i>
                <FontAwesomeIcon icon={faTimes} />
              </i>
            </button>

            <div className={classNames(styles.contentContainer)}>
              <div className={classNames(styles.sectionBar)}>
                <div className={classNames(styles.sectionTitle)}>
                  <span>General</span>
                </div>
              </div>
              <div className={classNames(styles.scrollingContent)}>{general}</div>
              <div className={classNames(styles.sectionBar)}>
                <div className={classNames(styles.sectionTitle)}>
                  <span>Touchscreen</span>
                </div>
              </div>
              <div className={classNames(styles.scrollingContent)}>{touchscreen}</div>
            </div>
          </div>
        </div>
      </IntlProvider>
    );
  }
}
