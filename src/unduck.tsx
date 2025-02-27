import { Action, ActionPanel, Form, open } from "@raycast/api";

export default function Command() {
  const handleSubmit = (values: { query: string }) => {
    open(`https://unduck.link?q=${encodeURIComponent(values.query)}`);
  };

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Search" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.Description text="Search anything, everywhere, using thousands of available bangs 💥" />
      <Form.TextArea id="query" placeholder="alfredmouelle !ghrepo" />
    </Form>
  );
}
