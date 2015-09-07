class SessionsController < Devise::SessionsController
  def destroy
    Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name)
    cookies['XSRF-TOKEN'] = form_authenticity_token 
    respond_to do |format|
      format.html
      format.json { head :no_content}
    end
  end
end
