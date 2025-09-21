<script lang="ts">
  const isClient = typeof window !== 'undefined'
  import { Button } from 'tint/components/index'
  import Modal from 'tint/components/Modal.svelte'
  import iconShare from 'tint/icons/20-link.svg?raw'
  import iconCopy from 'tint/icons/20-copy.svg?raw'
  import iconClose from 'tint/icons/20-close.svg?raw'
  import { onMount } from 'svelte'

  interface Props {
    comicId: string
  }

  let { comicId }: Props = $props()

  let modalOpen = $state(false)
  let copied = $state(false)

  function openShareDialog() {
    if (navigator.share) {
      navigator.share({
        url: shareLink,
      })
      return
    } else {
      modalOpen = true
    }
  }
  function copyLink() {
    navigator.clipboard.writeText(shareLink)
    copied = true
    setTimeout(() => (copied = false), 2000)
  }

  let shareLink = $state('')
  let socialLinks: { name: string; link: string; download?: string }[] = $state(
    [],
  )

  function selectText(event: Event) {
    ;(event.target as HTMLInputElement).select()
  }

  onMount(() => {
    shareLink = `${window.location.origin}/comic/${comicId}`
    const link = encodeURI(shareLink)
    socialLinks = [
      {
        name: 'Download',
        download: `ptbd-comic-${comicId}.png`,
        link: `/share/${comicId}.png`,
      },
      {
        name: 'Twitter / "X"',
        link: `https://twitter.com/share?hashtags=ptbd&url=${link}`,
      },
      {
        name: 'WhatsApp',
        link: `https://wa.me/?text=${link}`,
      },
      {
        name: 'Telegram',
        link: `https://t.me/share/url?url=${link}`,
      },
      {
        name: 'Reddit',
        link: `https://www.reddit.com/submit?url=${link}`,
      },
      {
        name: 'Facebook',
        link: `https://www.facebook.com/sharer.php?u=${link}`,
      },
      {
        name: 'Tumblr',
        link: `https://www.tumblr.com/widgets/share/tool?tags=ptbd&canonicalUrl=${link}`,
      },
      {
        name: 'Mail',
        link: `mailto:?to=&body=${link}`,
      },
    ]
  })
</script>

{#if isClient}
  <Button
    title="Share comic"
    icon={true}
    onclick={openShareDialog}
    aria-label="Share comic">{@html iconShare}</Button
  >

  <Modal bind:open={modalOpen}>
    <div class="share-content">
      <header class="tint--tinted">
        <h1 id="share-dialog-heading" class="tint--type-title-serif-3">
          Share this comic
        </h1>
        <Button
          icon={true}
          small={true}
          variant="ghost"
          onclick={() => (modalOpen = false)}
          aria-label="Close dialog">{@html iconClose}</Button
        >
      </header>
      <div class="copy-link">
        <div class="input" class:copied>
          <input
            class="tint--type-body-serif"
            type="text"
            readonly
            value={shareLink}
            onfocus={selectText}
            onclick={selectText}
          />
          <button onclick={copyLink} title="Copy link">{@html iconCopy}</button>
        </div>
      </div>
      <div class="share-links">
        {#each socialLinks as { name, link, download }}
          <Button href={link} {download} external={true}>{name}</Button>
        {/each}
      </div>
    </div>
  </Modal>
{:else}
  <Button
    title="Share comic"
    icon={true}
    external={true}
    href={`/share/${comicId}.png`}>{@html iconShare}</Button
  >
{/if}

<style lang="sass">
.share-content
  display: flex
  flex-direction: column
  max-width: 400px
  min-width: min(100vw - 128px, 400px)
  overflow: hidden
  :global(button)
    white-space: nowrap

header, .share-links, .copy-link
  padding: tint.$size-16
  display: flex
  background: var(--tint-bg)

.copy-link
  padding-block-end: 0

.input
  @include tint.effect-focus
  box-sizing: border-box
  background-color: var(--tint-input-bg)
  border-radius: tint.$input-radius
  width: 100%
  display: flex
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out
  &.copied
    background: #05FFA5
    color: black
  input, button
    @include tint.effect-focus
  input
    flex: 1
    border: none
    background: none
    padding: tint.$size-12
    border-radius: tint.$input-radius
    color: var(--tint-text)
  button
    border: none
    background: none
    height: calc(100% - tint.$size-8)
    aspect-ratio: 1
    margin: tint.$size-4
    display: flex
    align-items: center
    justify-content: center
    border-radius: tint.$input-radius - 2px
    color: var(--tint-action-primary)
    &:hover
      background-color: var(--tint-action-secondary-hover)
    &:active
      background-color: var(--tint-action-secondary-active)

header
  border-bottom: 1px solid var(--tint--card-border)
  gap: tint.$size-8
  align-items: center
  justify-content: space-between
  padding-block: tint.$size-8
  padding-inline-end: tint.$size-8
  > :global(button)
    border: none

.share-links
  display: grid
  grid-template-columns: repeat(auto-fill, minmax(128px, 1fr))
  gap: tint.$size-8
</style>
