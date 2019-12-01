import "../../styles/header/Header.css";
import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import { brandDropdownClick, menuDropdownClick } from "../../actions";
import { MENU_OPTIONS, BRAND_DROPDOWN_OPTIONS } from "./options";
import MakeUsername from "./MakeUsername";
import MenuButton from "./MenuButton";
import Dropdown from "./Dropdown";
import EmailModal from "./EmailModal";

class Header extends Component {
  onHeaderClick = () => {
    const {
      brandDropdownClick,
      menuDropdownClick,
      isBrandDropdownOn,
      isMenuDropdownOn
    } = this.props;

    // close modals if open
    if (isBrandDropdownOn) brandDropdownClick(false);
    if (isMenuDropdownOn) menuDropdownClick(false);
  };

  // render username modal (for external logins)
  renderModal = () => {
    const { auth, wasUsernameSuccessfullySet } = this.props;

    // only display if user is logged in, has no username (and wasUsernameSuccessfullySet is false - this will make modal disappear on successful submission with no errors)
    if (auth && auth.id && !auth.username && !wasUsernameSuccessfullySet) {
      console.log(auth.username);
      return <MakeUsername />;
    }
  };

  // render email feedback modal
  renderEmailModal = () => {
    const { emailStatus } = this.props;

    if (emailStatus) {
      return <EmailModal />;
    }
  };

  // open the brand dropdown menu on click
  onBrandClick = () => {
    const { brandDropdownClick, isBrandDropdownOn } = this.props;

    if (!isBrandDropdownOn) brandDropdownClick(true);
  };

  // will render dropdown component and pass it brand-options
  renderBrandDropdown = () => {
    const { isBrandDropdownOn } = this.props;

    if (isBrandDropdownOn)
      return (
        <Dropdown
          id="brand-dropdown"
          content={this.renderOptions(BRAND_DROPDOWN_OPTIONS)}
          onDismiss={() => this.props.brandDropdownClick(false)}
        />
      );
  };

  // renders menu options
  renderOptions = options => {
    return options.map(options => {
      return <MenuButton key={options.content} options={options} />;
    });
  };

  // open hamburger menu when clicked and it's closed
  onHamburgerClick = () => {
    const { menuDropdownClick, isMenuDropdownOn } = this.props;

    if (!isMenuDropdownOn) menuDropdownClick(true);
  };

  // will render dropdown component and pass it menu-options
  renderMenuDropdown = () => {
    const { isMenuDropdownOn } = this.props;

    if (isMenuDropdownOn) {
      return (
        <Dropdown
          id="menu-dropdown"
          content={this.renderOptions(MENU_OPTIONS)}
          onDismiss={() => this.props.menuDropdownClick(false)}
        />
      );
    }
  };

  render() {
    return (
      // container includes make username modal from Landing.js
      <div className="header-container" onClick={this.onHeaderClick}>
        {this.renderModal()}
        {this.renderEmailModal()}
        {/* ACTUAL HEADER STARTS HERE */}
        <nav className="header">
          <div className="header-top">
            {/* contains brand logo and brand dropdown */}
            <div className="brand-logo">
              {/* Brand logo */}
              <button
                className="menu-link"
                id="brand-link"
                onClick={this.onBrandClick}
              >
                Hidden Album
                <i className="fas fa-chevron-circle-down fa-xs" />
              </button>
              {/* Brand Dropdown */}
              <div className="brand-dropdown">{this.renderBrandDropdown()}</div>
            </div>
            <div className="right-options">
              {/* Menu options on top bar */}
              <div className="menu-options">
                {this.renderOptions(MENU_OPTIONS)}
              </div>
              {/* hamburger button */}
              <div className="hamburger-button">
                <button id="hamburger-button" onClick={this.onHamburgerClick}>
                  <i className="fas fa-bars fa-2x" />
                </button>
              </div>
            </div>
          </div>
          {/* dropdown menu options */}
          <div className="header-dropdown">{this.renderMenuDropdown()}</div>
        </nav>
      </div>
    );
  }
}

const mapStateToProps = ({
  auth,
  wasUsernameSuccessfullySet,
  isBrandDropdownOn,
  isMenuDropdownOn,
  emailStatus
}) => {
  return {
    auth,
    wasUsernameSuccessfullySet,
    isBrandDropdownOn,
    isMenuDropdownOn,
    emailStatus
  };
};

const connected = connect(mapStateToProps, {
  brandDropdownClick,
  menuDropdownClick
})(Header);

export default reduxForm({ form: "placeholder" })(connected);
