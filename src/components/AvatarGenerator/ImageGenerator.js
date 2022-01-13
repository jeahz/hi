import React, { Component } from 'react'
import './ImageGenerator.scss'

export default class ImageGenerator extends Component {
  constructor(props) {
    super(props)

    this.state = {
      avatarParts: {
        accessories: ['flower'],
        background: 'blue50',
        ears: 'default',
        eyes: 'default',
        hair: 'default',
        leg: 'default',
        mouth: 'default',
        neck: 'default',
        nose: 'nose',
      },
      currentCustomizePart: 'accessories'
    }

    this.handleChangeCurrentCutomizePart = this.handleChangeCurrentCutomizePart.bind(this);
    this.handleChangeCurrentCustomizeStyle = this.handleChangeCurrentCustomizeStyle.bind(this);
  }

  pathToImageFolder = `${process.env.PUBLIC_URL}/alpaca-generator-assets/alpaca`;
  // Property which type is array. 
  avatarPartStylesMap = {
    accessories: ['earings', 'flower', 'glasses', 'headphone'],
    backgrounds: ['blue50', 'blue60', 'blue70', 'darkblue30', 'darkblue50', 'darkblue70', 'green50', 'green60', 'green70', 'grey40', 'grey70', 'grey80', 'red50', 'red60', 'red70', 'yellow50', 'yellow60', 'yellow70'],
    ears: ['default', 'tilt-backward', 'tilt-forward'],
    eyes: ['angry', 'default', 'naughty', 'panda', 'smart', 'star'],
    hair: ['bang', 'curls', 'default', 'elegant', 'fancy', 'quiff', 'short'],
    leg: ['tilt-forward', 'tilt-backward', 'game-console', 'default', 'cookie', 'bubble-tea'],
    mouth: ['default', 'eating', 'laugh', 'tongue', 'astonished'],
    neck: ['bend-backward', 'bend-forward', 'default', 'thick'],
    nose: ['nose']
  }
  arrayStateProperties = ['accessories'];
  // Property which name is not same as folder. 
  notSameNamesWithFolder = ['background'];
  // Map of notSameNamesWithFolder to folder name. 
  notSameNamesWithFolderMap = {
    background: 'backgrounds'
  }

  handleChangeCurrentCutomizePart(e) {
    this.setState({
      currentCustomizePart: e.target.id
    })
  }

  handleChangeCurrentCustomizeStyle(e) {
    if (this.arrayStateProperties.includes(this.state.currentCustomizePart)) {

      if (e.target.dataset.chosen === 'true') {
        const toRemoveIndex = this.state.avatarParts[this.state.currentCustomizePart].indexOf(e.target.id)
        console.log(toRemoveIndex)
        e.target.dataset.chosen = false;

        this.setState({
          avatarParts: {
            ...this.state.avatarParts,
            [this.state.currentCustomizePart]: [
              ...this.state.avatarParts[this.state.currentCustomizePart].slice(0, toRemoveIndex),
              ...this.state.avatarParts[this.state.currentCustomizePart].slice(toRemoveIndex + 1)
            ]
          }
        })
      } else {
        e.target.dataset.chosen = true;
        this.setState({
          avatarParts: {
            ...this.state.avatarParts,
            [this.state.currentCustomizePart]: [
              ...this.state.avatarParts[this.state.currentCustomizePart],
              e.target.id
            ]
          }
        })
      }
    } else {
      this.setState({
        avatarParts: {
          ...this.state.avatarParts,
          [this.state.currentCustomizePart]: e.target.id
        }
      })
    }
  }

  render() {
    return (
      <div className="image-generator">
        <h1>ALPACA GENERATOR</h1>
        <div className="image-button-container">
          <div className="images-container">
            {/* The avatar part name in this class state is not same as folder name that contains the image. */}
            {
              Object.keys(this.state.avatarParts).map(avatarPart => {
                if (this.notSameNamesWithFolder.includes(avatarPart)) {
                  const folderName = this.notSameNamesWithFolderMap[this.notSameNamesWithFolder];
                  return (
                    <img className={`${avatarPart}`} src={`${this.pathToImageFolder}/${folderName}/${this.state.avatarParts[avatarPart]}.png`} alt={`${this.state.avatarParts[avatarPart]}_${avatarPart}`} key={`${this.state.avatarParts[avatarPart]}_${avatarPart}`} />
                  );
                }
                return null;
              })
            }

            {/* The avatar part has similar part rendered. */}
            {
              Object.keys(this.state.avatarParts).map(avatarParts => {
                if (this.arrayStateProperties.includes(avatarParts)) {
                  return this.state.avatarParts[avatarParts].map(avatarPart => {
                    return (
                      <img className={`${avatarParts}`} src={`${this.pathToImageFolder}/${avatarParts}/${avatarPart}.png`} alt={`${this.state.avatarParts[avatarPart]}_${avatarPart}`} key={`${this.state.avatarParts[avatarPart]}_${avatarPart}`} />
                    )
                  });
                }
                return null;
              })
            }

            {/* The avatar part name in this class state is same with folder name that contains the image. */}
            {
              Object.keys(this.state.avatarParts).map(avatarPart => {
                if (!this.arrayStateProperties.includes(avatarPart) && !this.notSameNamesWithFolder.includes(avatarPart)) {
                  return (
                    <img className={`${avatarPart}`} src={`${this.pathToImageFolder}/${avatarPart}/${this.state.avatarParts[avatarPart]}.png`} alt={`${this.state.avatarParts[avatarPart]}_${avatarPart}`} key={`${this.state.avatarParts[avatarPart]}_${avatarPart}`} />
                  )
                };
                return null;
              })
            }
          </div>
          <div className="customize-buttons-container">
            <div className="customize-part-buttons">
              <h2 className="customize-title">
                ACCESSORIZE THE ALPACA'S
              </h2>
              <div className="customize-buttons">
                {Object.keys(this.state.avatarParts).map(avatarPart => {
                  const isPartChosen = this.state.currentCustomizePart === avatarPart;
                  return (
                    <button id={avatarPart} className="avatar-part-button" key={`${avatarPart}_button`} onClick={this.handleChangeCurrentCutomizePart} data-chosen={isPartChosen}>{avatarPart}</button>
                  )
                })}
              </div>
            </div>
            <div className="customize-style-buttons">
              <h2 className="customize-title">
                STYLE
              </h2>
              <div className="customize-buttons">
                {Object.keys(this.state.avatarParts).map(avatarPart => {
                  if (avatarPart === this.state.currentCustomizePart) {
                    let styles = [];
                    if ((this.notSameNamesWithFolder).includes(avatarPart)) {
                      // Folder name is the subimage folder name.
                      const folderName = this.notSameNamesWithFolderMap[this.notSameNamesWithFolder];
                      styles = this.avatarPartStylesMap[folderName];
                    } else {
                      styles = this.avatarPartStylesMap[avatarPart];
                    };


                    return styles.map(style => {
                      let isStyleChosen;
                      if (this.arrayStateProperties.includes(this.state.currentCustomizePart)) {
                        // If its styles can be chosen more than 1. 
                        isStyleChosen = this.state.avatarParts[avatarPart].includes(style);
                      } else {
                        isStyleChosen = style === this.state.avatarParts[avatarPart]
                      }
                      return (
                        <button id={style} className="avatar-style-button" key={`${style}_${avatarPart}_button`} onClick={this.handleChangeCurrentCustomizeStyle} data-chosen={isStyleChosen}>{style}</button>);
                    });
                  }
                  return null;
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
