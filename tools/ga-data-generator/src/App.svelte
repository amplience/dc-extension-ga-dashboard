<script>
  window.ga =
    window.ga ||
    function () {
      (ga.q = ga.q || []).push(arguments);
    };
	ga.l = +new Date();

  let gaId = 'UA-182105724-1',
    hitType = 'event',
    eventCategory = 'Banners',
    eventAction = 'Click',
    eventLabel = '/shop/mens/sale',
    dimension1 = '',
    dimension2 = '',
    dimension3 = '';

  const submit = () => {
    ga('create', gaId, 'auto');
    ga('send', {
      hitType,
      eventCategory,
      eventAction,
      eventLabel,
      dimension1,
      dimension2,
      dimension3,
    });
  };
</script>

<style>
  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
    align-items: center;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  .content {
    margin: 0 auto;
    width: 500px;
    display: grid;
    grid-template-columns: 30% 70%;
    grid-column-gap: 10px;
  }
</style>

<main>
  <h1>Google Analytics Data Generator</h1>
  <form class="content">
    <label>GA Tracking Code</label>
    <input type="text" bind:value={gaId} />

    <label>Hit Type</label>
    <input type="text" bind:value={hitType} />

    <label>Event Category</label>
    <input type="text" bind:value={eventCategory} />

    <label>Event Action</label>
    <input type="text" bind:value={eventAction} />

    <label>Event Label</label>
    <input type="text" bind:value={eventLabel} />

    <label>Dimension1 (ContentItemId)</label>
    <input type="text" bind:value={dimension1} />

    <label>Dimension2 (EditionId)</label>
    <input type="text" bind:value={dimension2} />

    <label>Dimension3 (SlotId)</label>
    <input type="text" bind:value={dimension3} />
  </form>
  <button on:click={submit}>Submit</button>
</main>
