<template>
    <div class="share-dialog">
        <section class="inner" ref="sharedialog">
            <div class="header">Share this comic</div>
            <div class="main">
                <div class="link">
                    <transition name="fade">
                        <div v-if="copySuccessDialog" class="overlay">
                            Link copied!
                        </div>
                    </transition>
                    <input ref="input" type="text" @click="selectLink" :value="comicInfo.url">
                    <div class="btn" @click="copyLink" role="button" aria-label="Copy to Clipboard">
                        <Vector :src="require('../../referenced/icon_content_copy.svg')" />
                    </div>
                </div>
                <hr>
                <a v-for="s in socialUrls" :href="s.link" :download="s.download" target="_blank" rel="noopener noreferrer" class="ptbd-button">
                    <div class="icon" :style="{'background-color': s.color}" aria-hidden="true">
                        <span>{{s.icon ? s.icon : s.name.charAt(0)}}</span>
                    </div>
                    <span>{{s.name}}</span>
                </a>
            </div>
            <a @click="$emit('close')" class="footer">Close</a>
        </section>
    </div>
</template>

<script>

export default {
    name: 'Share',
    props: ['comicInfo'],
    data() {
        return {
            copySuccessDialog: false
        }
    },
    mounted() {
        document.body.classList.add('active-modal')
        this.$nextTick(() => {
            this.$refs.sharedialog.focus();
        })
    },
    destroyed() {
        document.body.classList.remove('active-modal')
    },
    methods: {
        copyLink() {
            this.$refs.input.select();
            document.execCommand('copy');
            this.copySuccessDialog = true
            setTimeout(()=>{this.copySuccessDialog = false}, 2000);
        },
        selectLink() {
            this.$refs.input.select()
        }
    },
    computed: {
        socialUrls() {
            const link = encodeURI(this.comicInfo.url)
            return [{
                name: 'Download as Image',
                color: '#795548',
                link: this.comicInfo.share,
                icon: '⬇︎',
                download: 'ptbd-comic',
            }, {
                name: 'Twitter',
                color: '#55acee',
                link: `http://twitter.com/share?hashtags=ptbd&url=${link}`,
            }, {
                name: 'WhatsApp',
                color: '#25d366',
                link: `https://wa.me/?text=${link}`,
            }, {
                name: 'Telegram',
                color: '#0088cc',
                link: `https://t.me/share/url?url=${link}`,
            }, {
                name: 'Reddit',
                color: '#ff4500',
                link: `https://www.reddit.com/submit?url=${link}`,
            }, {
                name: 'Facebook',
                color: '#3b5998',
                link: `https://www.facebook.com/sharer.php?u=${link}`,
            }, {
                name: 'Tumblr',
                color: '#35465c',
                link: `https://www.tumblr.com/widgets/share/tool?tags=ptbd&canonicalUrl=${link}`,
            }, {
                name: 'Mail',
                color: '#ffb300',
                link: `mailto:?to=&body=${link}`,
            }]
        }
    }
}
</script>