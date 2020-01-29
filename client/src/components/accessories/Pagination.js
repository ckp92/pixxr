import "../../styles/accessories/Pagination.css";
import React, { Component } from "react";
import { connect } from "react-redux";
import { getPhotos, setPage } from "../../actions";
import PaginationButton from "./PaginationButton";

// id, content, onclick
// onclick card remembers page and runs fn maybe?
class Pagination extends Component {
  renderPagination = () => {
    const { currentPage, photos } = this.props;

    // error check
    if (!photos) return;

    const { total } = photos;

    // no photos
    if (!total) return;

    const photosPerPage = 10;

    // get total pages
    const numPages = Math.ceil(total / photosPerPage);
    const pagesZeroIndexed = numPages - 1;

    const first = () => {
      // if on first page, do nothing
      if (currentPage === 0) return;
      // change to first page
      this.changePage(0);
    };

    const prev = () => {
      // if on first page, do nothing
      if (currentPage === 0) return;
      // change to previous page
      this.changePage(currentPage - 1);
    };

    const next = () => {
      // if on last page, do noghing
      if (currentPage === pagesZeroIndexed) return;
      // change to next page
      this.changePage(currentPage + 1);
    };

    const last = () => {
      // if already on last page, do nothing
      if (currentPage === pagesZeroIndexed) return;
      // change to last page
      this.changePage(pagesZeroIndexed);
    };

    return (
      <div className="pagination-inner">
        {this.renderLeft(first, prev, 0)}
        <div className="current-page">
          Page {currentPage + 1} of {numPages}
        </div>
        {this.renderRight(next, last, pagesZeroIndexed)}
      </div>
    );
  };

  // run action creators to change the page
  changePage = pageNumber => {
    const {
      getPhotos,
      setPage,
      searchType: { searchType, value }
    } = this.props;

    getPhotos(pageNumber, searchType, value);
    setPage(pageNumber);
  };

  // render left buttons
  renderLeft = (first, prev, validator) => {
    const { currentPage } = this.props;

    if (currentPage > validator) {
      return (
        <div className="left-buttons">
          <PaginationButton
            onClick={first}
            content={<i className="fas fa-angle-double-left fa-3x"></i>}
          />
          <PaginationButton
            onClick={prev}
            content={<i className="fas fa-angle-left fa-3x"></i>}
          />
        </div>
      );
    }
  };

  // render right buttons
  renderRight = (next, last, validator) => {
    const { currentPage } = this.props;

    if (currentPage < validator) {
      return (
        <div className="right-buttons">
          <PaginationButton
            onClick={next}
            content={<i className="fas fa-angle-right fa-3x"></i>}
          />
          <PaginationButton
            onClick={last}
            content={<i className="fas fa-angle-double-right fa-3x"></i>}
          />
        </div>
      );
    }
  };

  render() {
    return (
      <div className="pagination-container">{this.renderPagination()}</div>
    );
  }
}

const mapStateToProps = ({ photos, currentPage, searchType }) => {
  return { photos, currentPage, searchType };
};

export default connect(mapStateToProps, { getPhotos, setPage })(Pagination);
