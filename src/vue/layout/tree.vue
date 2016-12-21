<template>
    <div class="component-layout-tree">
        <svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
        xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" viewBox="0 0 664.96103 670.99096" version="1.1" inkscape:version="0.91 r13725" sodipodi:docname="tree-single.svg">
          <sodipodi:namedview
             pagecolor="#ffffff"
             bordercolor="#666666"
             borderopacity="1"
             objecttolerance="10"
             gridtolerance="10"
             guidetolerance="10"
             inkscape:pageopacity="0"
             inkscape:pageshadow="2"
             inkscape:window-width="1920"
             inkscape:window-height="1896"
             showgrid="false"
             fit-margin-top="0"
             fit-margin-left="0"
             fit-margin-right="0"
             fit-margin-bottom="0"
             inkscape:zoom="1.2685914"
             inkscape:cx="511.94249"
             inkscape:cy="413.57023"
             inkscape:window-x="0"
             inkscape:window-y="24"
             inkscape:window-maximized="1"
             inkscape:current-layer="svg51928" />
          <metadata>
            <rdf:RDF>
              <cc:Work
                 rdf:about="">
                <dc:format>image/svg+xml</dc:format>
                <dc:type
                   rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
                <dc:title></dc:title>
              </cc:Work>
            </rdf:RDF>
          </metadata>
          <g
             transform="translate(-3419.683,-2082.032)">
            <rect
               style="fill:#b07f48"
               x="3717.625"
               y="2648.679"
               width="69.070999"
               height="104.344" />
          </g>
          <g
             transform="translate(-3419.683,-2082.032)">
            <polygon
               style="fill:#008a2e"
               points="3540.578,2455.753 3627.961,2455.753 3419.683,2664.031 4084.644,2664.031 3876.367,2455.753 3963.749,2455.753 3809.875,2301.88 3881.908,2301.88 3752.163,2172.133 3622.416,2301.88 3694.449,2301.88 " />
          </g>
          <g v-if="showStar"
             transform="translate(-3419.683,-2082.032)">
            <polygon
               points="3752.102,2082.032 3765.951,2110.106 3796.935,2114.606 3774.515,2136.459 3779.807,2167.315 3752.102,2152.744 3724.398,2167.315 3729.685,2136.459 3707.269,2114.606 3738.253,2110.106 "
               :style="starStyle"
               :stroke-width="strokeWidthStar"
               stroke="#FFFFFF" />
          </g>
          <g v-if="showCord">
            <path
               d="m 384.20239,143.78076 c 0,0 -37.90046,16.79733 -79.60717,33.11479 -41.70672,16.31745 -95.03366,36.75235 -95.03366,36.75235"
               style="fill:none;stroke:#006838;stroke-width:3.27561069"
               inkscape:connector-curvature="0" />
            <path
               d="m 410.71584,240.15709 c 0,0 -56.59982,28.93869 -101.46745,50.77824 -44.86764,21.83956 -165.52558,60.48997 -165.52558,60.48997"
               style="fill:none;stroke:#006838;stroke-width:3.2519207"
               inkscape:connector-curvature="0" />
            <path
               d="m 482.43891,312.76494 c 0,0 -124.45359,56.50919 -166.61948,71.93628 -42.16592,15.42709 -174.80239,58.89583 -174.80239,58.89583"
               style="fill:none;stroke:#006838;stroke-width:3.24235559"
               inkscape:connector-curvature="0" />
            <path
               d="m 478.51377,395.75711 c 0,0 -141.19356,61.34891 -181.63261,80.87319 -77.21106,37.27645 -258.455523,70.89404 -258.455523,70.89404"
               style="fill:none;stroke:#006838;stroke-width:3.27561069"
               inkscape:connector-curvature="0" />
            <path
               d="m 551.2438,467.27351 c 0,0 -133.98067,60.85922 -210.3499,82.8402 -76.36923,21.97935 -146.94226,28.75495 -146.94226,28.75495"
               style="fill:none;stroke:#006838;stroke-width:3.27561069"
               inkscape:connector-curvature="0" />
            <path
               d="m 616.26963,536.05727 c 0,0 -56.80316,21.85833 -75.91711,26.86487 -19.11394,5.00653 -86.90978,15.62962 -86.90978,15.62962"
               style="fill:none;stroke:#006838;stroke-width:3.60957623"
               inkscape:connector-curvature="0" />
          </g>
        <circle v-for="(item, index) in lightbulbs"
           r="10.056"
           :cy="item.y"
           :cx="item.x"
           :style="bulbStyle(index)"
           :stroke-width="strokeWidth(index)"
           stroke="#FFFFFF" />
        </svg>
    </div>
</template>

<style lang="sass">
    .component-layout-tree {
        position: relative;

        svg {
            width: 100%;
        }
    }
</style>

<script>
    export default {
        data() {
            return {
                lightbulbCoords: [
                    { x: 456.5067, y: 576.7912 },
                    { x: 498.0819, y: 570.4302 },
                    { x: 541.3264, y: 561.8371 },
                    { x: 581.8252, y: 549.6701 },
                    { x: 615.4205, y: 534.7161 },
                    { x: 196.7605, y: 574.5616 },
                    { x: 245.8113, y: 568.9877 },
                    { x: 293.7474, y: 561.7415 },
                    { x: 337.2242, y: 550.5936 },
                    { x: 381.8158, y: 532.1996 },
                    { x: 423.063,  y: 519.9369 },
                    { x: 460.4085, y: 505.8706 },
                    { x: 507.2297, y: 486.4932 },
                    { x: 547.3622, y: 464.7548 },
                    { x: 37.9029,  y: 545.0197 },
                    { x: 84.7242,  y: 537.7736 },
                    { x: 132.6601, y: 530.5274 },
                    { x: 176.6943, y: 516.5926 },
                    { x: 219.0563, y: 504.8872 },
                    { x: 261.4185, y: 486.4932 },
                    { x: 307.1249, y: 470.3287 },
                    { x: 350.6017, y: 450.2624 },
                    { x: 389.6193, y: 433.5406 },
                    { x: 436.4405, y: 414.5891 },
                    { x: 476.573,  y: 393.9655 },
                    { x: 132.6601, y: 444.6885 },
                    { x: 175.5796, y: 434.6554 },
                    { x: 217.9416, y: 416.8188 },
                    { x: 261.9758, y: 400.0969 },
                    { x: 303.7805, y: 385.0473 },
                    { x: 347.6234, y: 368.6122 },
                    { x: 389.6194, y: 349.9313 },
                    { x: 436.9979, y: 329.8651 },
                    { x: 481.0322, y: 308.1267 },
                    { x: 135.8551, y: 352.7429 },
                    { x: 182.2682, y: 332.652  },
                    { x: 232.4339, y: 315.9302 },
                    { x: 280.9272, y: 298.0935 },
                    { x: 323.2893, y: 278.0273 },
                    { x: 371.2252, y: 258.5185 },
                    { x: 408.5708, y: 237.8948 },
                    { x: 208.4659, y: 215.599  },
                    { x: 256.4019, y: 196.2254 },
                    { x: 303.2231, y: 179.3684 },
                    { x: 348.4117, y: 161.014  },
                    { x: 384.0453, y: 142.5803 }
                ]
            }
        },

        computed: {
            lightbulbs() {
                return this.lightbulbCoords.slice(0, this.lightbulbCount);
            },

            poweredLightBulbs() {
                return Math.ceil(this.$store.state.lightsPower * Math.min(this.lightbulbCoords.length + 1, this.lightbulbCount));
            },

            lightbulbCount() {
                return this.$store.state.items['lightbulb'] || 0;
            },

            showStar() {
                return this.lightbulbCount >= this.lightbulbCoords.length + 1;
            },

            starStyle() {
                return this.bulbStyle(this.lightbulbCoords.length);
            },

            showCord() {
                return this.lightbulbCount >= 1;
            },

            strokeWidthStar() {
                return this.lightOn(this.lightbulbCoords.length)? 2 : 0
            }
        },

        methods: {
            lightOn(index) {
                return this.$store.state.lightsOn && index <= this.poweredLightBulbs;
            },

            bulbStyle(index) {
                return {
                    fill: this.lightOn(index)? '#fefc5e' : '#999',
                }
            },

            strokeWidth(index) {
                return this.lightOn(index)? 2 : 0
            }
        }
    }
</script>
