"use strict";

const React = require('react');
const { GridList, GridTile } = require('material-ui/GridList');
const Subheader = require('material-ui/Subheader').default;


const styles = {
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    gridList: {
        width: 620,
        overflowY: 'auto',
    },
    gridTile: {
        width: '150px',
        height: '200px',
    },
};

class ResultList extends React.Component {

    handleResultClick(result) {
        let mangaUrl = result.url;

        if (mangaUrl.endsWith('/')) {
            mangaUrl = mangaUrl.substr(0, mangaUrl.length - 1);
        }
        const index = mangaUrl.lastIndexOf('/');
        if (index >= 0) {
            const mangaId = mangaUrl.substr(index + 1);
            this.props.onResultClick(mangaId);
        }
    }

    render() {
        const { results } = this.props;

        if (results.length === 0) {
            return (<Subheader>0 Results</Subheader>);
        }

        return (
            <div style={styles.root}>
                <Subheader>{results.length} Results:</Subheader>

                <GridList
                    cellHeight={200}
                    cols={4}
                    style={styles.gridList}>

                    {results.map((tile) => (
                        <GridTile
                            style={styles.gridTile}
                            key={tile.url}
                            title={tile.title}
                            onTouchTap={() => this.handleResultClick(tile)}>
                            <img src={tile.imageUrl} />
                        </GridTile>
                    ))}
                </GridList>
            </div>
        )
    }
}

ResultList.propTypes = {
    results: React.PropTypes.array.isRequired,
    onResultClick: React.PropTypes.func.isRequired,
};


module.exports = ResultList;
